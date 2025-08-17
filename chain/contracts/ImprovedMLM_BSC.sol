// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ImprovedMLM_BSC is ReentrancyGuard, Ownable, Pausable {
    uint256 public constant REGISTRATION_PRICE = 0.025 ether;
    uint8 public constant REWARD_PAYOUTS = 2;
    uint8 public constant REWARD_PERCENT = 74;
    uint8 public constant MAX_REFERRAL_LINES = 3;
    uint8 public constant MAX_LEVELS = 16;

    struct UserLevelInfo {
        uint16 activationTimes;
        uint16 maxPayouts;
        uint16 payouts;
        bool active;
        uint256 rewardSum;
        uint256 referralPayoutSum;
    }

    struct User {
        uint256 id;
        uint256 registrationTimestamp;
        address referrer;
        uint256 referrals;
        uint256 referralPayoutSum;
        uint256 levelsRewardSum;
        uint256 missedReferralPayoutSum;
        mapping(uint8 => UserLevelInfo) levels;
    }

    struct GlobalStat {
        uint256 members;
        uint256 transactions;
        uint256 turnover;
    }

    event UserRegistration(uint256 indexed userId, uint256 indexed referrerId, address indexed userAddress);
    event BuyLevel(uint256 indexed userId, uint8 indexed level, uint256 value);
    event LevelPayout(uint256 indexed userId, uint8 indexed level, uint256 rewardValue, uint256 indexed fromUserId);
    event LevelDeactivation(uint256 indexed userId, uint8 indexed level);
    event IncreaseLevelMaxPayouts(uint256 indexed userId, uint8 indexed level, uint16 newMaxPayouts);
    event ReferralPayout(uint256 indexed referrerId, uint256 indexed referralId, uint8 indexed level, uint256 rewardValue);
    event MissedReferralPayout(uint256 indexed referrerId, uint256 indexed referralId, uint8 indexed level, uint256 rewardValue);
    event TokenBurnerUpdated(address indexed oldBurner, address indexed newBurner);

    uint8[4] public referralRewardPercents = [0, 13, 8, 5];
    address payable public tokenBurner;

    uint256[17] public levelPrices = [
        0,
        0.05 ether,
        0.07 ether,
        0.1 ether,
        0.14 ether,
        0.2 ether,
        0.28 ether,
        0.4 ether,
        0.55 ether,
        0.8 ether,
        1.1 ether,
        1.6 ether,
        2.2 ether,
        3.2 ether,
        4.4 ether,
        6.5 ether,
        8 ether
    ];

    mapping(uint8 => uint256) public minUsersForLevel;

    uint256 private nextUserId = 2;
    mapping(address => User) public users;
    mapping(uint256 => address) public usersAddressById;
    mapping(uint8 => address[]) public levelQueue;
    mapping(uint8 => uint256) public headIndex;
    GlobalStat public globalStat;

    modifier onlyRegisteredUser() {
        require(isUserRegistered(msg.sender), "User not registered");
        _;
    }

    modifier validLevel(uint8 level) {
        require(level > 0 && level <= MAX_LEVELS, "Invalid level");
        _;
    }

    modifier notContract() {
        require(!_isContract(msg.sender), "Contracts not allowed");
        _;
    }

    constructor(address payable _tokenBurner) Ownable(msg.sender) {
        require(_tokenBurner != address(0), "Invalid token burner address");
        tokenBurner = _tokenBurner;

        for (uint8 i = 4; i <= MAX_LEVELS; i++) {
            minUsersForLevel[i] = 1;
        }

        _registerOwner();
        emit TokenBurnerUpdated(address(0), _tokenBurner);
    }

    function _registerOwner() private {
        users[owner()].id = 1;
        users[owner()].registrationTimestamp = block.timestamp;
        users[owner()].referrer = address(0);
        usersAddressById[1] = owner();
        globalStat.members = 1;
        globalStat.transactions = 1;
        for (uint8 level = 1; level <= MAX_LEVELS; level++) {
            users[owner()].levels[level].active = true;
            users[owner()].levels[level].maxPayouts = 56666;
            levelQueue[level].push(owner());
        }
    }

    receive() external payable whenNotPaused notContract {
        if (!isUserRegistered(msg.sender)) {
            if (msg.value == REGISTRATION_PRICE) {
                _register(owner());
                return;
            }
            revert("Registration required");
        }
        for (uint8 level = 1; level <= MAX_LEVELS; level++) {
            if (levelPrices[level] == msg.value) {
                buyLevel(level);
                return;
            }
        }
        revert("Invalid payment amount");
    }

    function register() external payable whenNotPaused {
        registerWithReferrer(owner());
    }

    function registerWithReferrer(address referrer) public payable whenNotPaused notContract {
        require(msg.value == REGISTRATION_PRICE, "Send exactly 0.025 BNB for registration");
        require(isUserRegistered(referrer), "Referrer not registered");
        require(!isUserRegistered(msg.sender), "Already registered");
        _register(referrer);
    }

    function _register(address referrer) private {
        uint256 userId = nextUserId++;
        users[msg.sender].id = userId;
        users[msg.sender].registrationTimestamp = block.timestamp;
        users[msg.sender].referrer = referrer;
        usersAddressById[userId] = msg.sender;
        _updateReferralStats(referrer);
        (bool success, ) = tokenBurner.call{value: msg.value}("");
        require(success, "BNB transfer to token burner failed");
        globalStat.members++;
        globalStat.transactions++;
        emit UserRegistration(userId, users[referrer].id, msg.sender);
    }

    function _updateReferralStats(address referrer) private {
        uint8 line = 1;
        address currentRef = referrer;
        while (line <= MAX_REFERRAL_LINES && currentRef != address(0)) {
            users[currentRef].referrals++;
            currentRef = users[currentRef].referrer;
            line++;
        }
    }

    function buyLevel(uint8 level) public payable nonReentrant onlyRegisteredUser validLevel(level) whenNotPaused notContract {
        require(levelPrices[level] == msg.value, "Invalid BNB amount for level");
        require(globalStat.members >= minUsersForLevel[level], "Level not available");
        for (uint8 l = 1; l < level; l++) {
            require(users[msg.sender].levels[l].active, "Previous levels must be active");
        }
        globalStat.transactions++;
        globalStat.turnover += msg.value;
        _processLevelPurchase(level);
        _distributeLevelReward(level);
        _distributeReferralRewards(level);
    }

    function _processLevelPurchase(uint8 level) private {
        if (!users[msg.sender].levels[level].active) {
            users[msg.sender].levels[level].active = true;
            users[msg.sender].levels[level].activationTimes = 1;
            users[msg.sender].levels[level].maxPayouts = REWARD_PAYOUTS;
            levelQueue[level].push(msg.sender);
            emit BuyLevel(users[msg.sender].id, level, msg.value);
        } else {
            users[msg.sender].levels[level].activationTimes++;
            users[msg.sender].levels[level].maxPayouts += REWARD_PAYOUTS;
            emit IncreaseLevelMaxPayouts(users[msg.sender].id, level, users[msg.sender].levels[level].maxPayouts);
        }
        
        // When activating a new level, check and reactivate all previously frozen levels
        _reactivateFrozenLevels(msg.sender, level);
    }

    function _distributeLevelReward(uint8 level) private {
        uint256 reward = (msg.value * REWARD_PERCENT) / 100;
        address rewardAddress = levelQueue[level][headIndex[level]];
        if (rewardAddress != msg.sender) {
            _sendReward(rewardAddress, reward);
            _updateUserLevelStats(rewardAddress, level, reward);
            _processQueuePosition(rewardAddress, level);
            emit LevelPayout(users[rewardAddress].id, level, reward, users[msg.sender].id);
        } else {
            // Buyer is at the head of the queue for this level.
            // Business rule: avoid self-reward, route funds to owner,
            // but DO NOT skip the buyer's cycle progression.
            _sendReward(owner(), reward);
            _updateUserLevelStats(owner(), level, reward);
            _processQueuePosition(rewardAddress, level);
            // No LevelPayout event for the buyer to avoid misleading accounting of funds.
        }
        delete levelQueue[level][headIndex[level]];
        headIndex[level]++;
    }

    function _processQueuePosition(address userAddress, uint8 level) private {
        users[userAddress].levels[level].payouts++;
        
        // Check if user should continue in queue
        bool shouldContinue = false;
        
        if (users[userAddress].levels[level].payouts < users[userAddress].levels[level].maxPayouts) {
            // Still within initial payouts limit
            shouldContinue = true;
        } else if (level < MAX_LEVELS && users[userAddress].levels[level + 1].active) {
            // Exceeded initial limit but next level is active - infinite cycles
            shouldContinue = true;
        }
        // If next level is not active and exceeded maxPayouts, level gets frozen (not deactivated)
        
        if (shouldContinue) {
            levelQueue[level].push(userAddress);
        } else {
            // Level is frozen but remains active for reactivation
            // Don't set active = false, just don't add back to queue
            emit LevelDeactivation(users[userAddress].id, level);
        }
    }

    function _updateUserLevelStats(address userAddress, uint8 level, uint256 reward) private {
        users[userAddress].levels[level].rewardSum += reward;
        users[userAddress].levelsRewardSum += reward;
    }

    function _reactivateFrozenLevels(address userAddress, uint8 newLevel) private {
        // Check all levels below the newly activated level
        for (uint8 i = 1; i < newLevel; i++) {
            if (users[userAddress].levels[i].active && _wasLevelFrozenBefore(userAddress, i, newLevel)) {
                // Level was frozen but should now be reactivated due to new level
                levelQueue[i].push(userAddress);
                // Note: we don't emit BuyLevel since this is just reactivation
            }
        }
    }
    
    function _wasLevelFrozenBefore(address userAddress, uint8 level, uint8 newlyActivatedLevel) private view returns (bool) {
        UserLevelInfo storage levelInfo = users[userAddress].levels[level];
        if (!levelInfo.active) return false;
        
        // Level was frozen if it exceeded maxPayouts and the next level was not active before this purchase
        if (levelInfo.payouts < levelInfo.maxPayouts) return false;
        if (level >= MAX_LEVELS) return true; // Last level always freezes after maxPayouts
        
        // Check if the level that was just activated is the next level that unfreezes this one
        return level + 1 == newlyActivatedLevel;
    }

    function _distributeReferralRewards(uint8 level) private {
        uint256 onePercent = msg.value / 100;
        for (uint8 line = 1; line <= MAX_REFERRAL_LINES; line++) {
            uint256 rewardValue = onePercent * referralRewardPercents[line];
            _sendReferralReward(msg.sender, line, level, rewardValue);
        }
    }

    function _sendReferralReward(address userAddress, uint8 line, uint8 level, uint256 rewardValue) private {
        address referrer = _findReferrer(userAddress, line);
        uint8 skipCount = 0;
        
        // Prevent infinite loop by limiting skips to MAX_REFERRAL_LINES
        while (!users[referrer].levels[level].active && referrer != owner() && referrer != address(0) && skipCount < MAX_REFERRAL_LINES) {
            users[referrer].missedReferralPayoutSum += rewardValue;
            emit MissedReferralPayout(users[referrer].id, users[userAddress].id, level, rewardValue);
            referrer = users[referrer].referrer;
            skipCount++;
        }
        
        // If all referrers are invalid, send to owner
        if (referrer == address(0) || skipCount >= MAX_REFERRAL_LINES) {
            referrer = owner();
        }
        
        _sendReward(referrer, rewardValue);
        users[referrer].levels[level].referralPayoutSum += rewardValue;
        users[referrer].referralPayoutSum += rewardValue;
        emit ReferralPayout(users[referrer].id, users[userAddress].id, level, rewardValue);
    }

    function _findReferrer(address userAddress, uint8 line) private view returns (address) {
        address referrer = users[userAddress].referrer;
        for (uint8 i = 1; i < line && referrer != owner() && referrer != address(0); i++) {
            referrer = users[referrer].referrer;
            if (referrer == address(0)) break; // Prevent accessing zero address
        }
        return referrer == address(0) ? owner() : referrer;
    }

    function _sendReward(address recipient, uint256 amount) private {
        (bool success, ) = payable(recipient).call{value: amount}("");
        if (!success) {
            payable(owner()).transfer(amount);
        }
    }

    function setTokenBurner(address payable _tokenBurner) external onlyOwner {
        require(_tokenBurner != address(0), "Invalid address");
        address oldBurner = tokenBurner;
        tokenBurner = _tokenBurner;
        emit TokenBurnerUpdated(oldBurner, _tokenBurner);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
    function emergencyWithdraw() external onlyOwner { payable(owner()).transfer(address(this).balance); }
    function getContractBalance() external view returns (uint256) { return address(this).balance; }
    function getAllLevelPrices() external view returns (uint256[17] memory) { return levelPrices; }

    function getUser(address userAddress) external view returns (
        uint256 id,
        uint256 registrationTimestamp,
        uint256 referrerId,
        address referrer,
        uint256 referrals,
        uint256 referralPayoutSum,
        uint256 levelsRewardSum,
        uint256 missedReferralPayoutSum
    ) {
        User storage user = users[userAddress];
        return (
            user.id,
            user.registrationTimestamp,
            users[user.referrer].id,
            user.referrer,
            user.referrals,
            user.referralPayoutSum,
            user.levelsRewardSum,
            user.missedReferralPayoutSum
        );
    }

    function getUserLevels(address userAddress) external view returns (
        bool[] memory active,
        uint16[] memory payouts,
        uint16[] memory maxPayouts,
        uint16[] memory activationTimes,
        uint256[] memory rewardSum,
        uint256[] memory referralPayoutSum
    ) {
        active = new bool[](MAX_LEVELS + 1);
        payouts = new uint16[](MAX_LEVELS + 1);
        maxPayouts = new uint16[](MAX_LEVELS + 1);
        activationTimes = new uint16[](MAX_LEVELS + 1);
        rewardSum = new uint256[](MAX_LEVELS + 1);
        referralPayoutSum = new uint256[](MAX_LEVELS + 1);
        for (uint8 level = 1; level <= MAX_LEVELS; level++) {
            UserLevelInfo storage levelInfo = users[userAddress].levels[level];
            active[level] = levelInfo.active;
            payouts[level] = levelInfo.payouts;
            maxPayouts[level] = levelInfo.maxPayouts;
            activationTimes[level] = levelInfo.activationTimes;
            rewardSum[level] = levelInfo.rewardSum;
            referralPayoutSum[level] = levelInfo.referralPayoutSum;
        }
    }

    function isUserRegistered(address userAddress) public view returns (bool) {
        return users[userAddress].id != 0;
    }

    function getPlaceInQueue(address userAddress, uint8 level) external view validLevel(level) returns (uint256 place, uint256 totalInQueue) {
        if (!users[userAddress].levels[level].active) return (0, 0);
        totalInQueue = levelQueue[level].length - headIndex[level];
        for (uint256 i = headIndex[level]; i < levelQueue[level].length; i++) {
            place++;
            if (levelQueue[level][i] == userAddress) return (place, totalInQueue);
        }
        return (0, totalInQueue);
    }

    function isLevelFrozen(address userAddress, uint8 level) external view validLevel(level) returns (bool) {
        UserLevelInfo storage levelInfo = users[userAddress].levels[level];
        if (!levelInfo.active) return false;
        
        // Level is frozen if it exceeded maxPayouts but next level is not active
        if (levelInfo.payouts < levelInfo.maxPayouts) return false;
        if (level >= MAX_LEVELS) return true; // Last level always freezes after maxPayouts
        
        // Check if next level exists and is active
        if (level + 1 <= MAX_LEVELS) {
            return !users[userAddress].levels[level + 1].active;
        }
        
        return true; // No next level, so freeze
    }

    function _isContract(address account) private view returns (bool) { return account.code.length > 0; }

    function getGlobalStats() external view returns (uint256 members, uint256 transactions, uint256 turnover) {
        return (globalStat.members, globalStat.transactions, globalStat.turnover);
    }
}

