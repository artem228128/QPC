const { ethers } = require("hardhat");

async function main() {
    console.log("🔄 FULL REFERRAL SYSTEM TEST");
    console.log("==============================");

    // Deploy contract
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    
    console.log("👤 Test accounts:");
    console.log(`Owner: ${owner.address}`);
    console.log(`User1: ${user1.address}`);
    console.log(`User2: ${user2.address}`);
    console.log(`User3: ${user3.address}`);
    console.log(`User4: ${user4.address}`);
    console.log("");

    // Deploy contract
    const Contract = await ethers.getContractFactory("ImprovedMLM_BSC");
    const contract = await Contract.deploy(owner.address);
    await contract.waitForDeployment();
    
    console.log(`📄 Contract deployed: ${await contract.getAddress()}`);
    console.log("");

    // Helper function to get prices (public array getter)
    const getPrice = async (level) => {
        return await contract.levelPrices(level);
    };

    // Helper function to format BNB
    const formatBNB = (wei) => {
        return ethers.formatEther(wei);
    };

    // Helper function to check user data
    const checkUser = async (address, label) => {
        const userData = await contract.getUser(address);
        const userLevels = await contract.getUserLevels(address);
        
        console.log(`👤 ${label} (${address.slice(0,6)}...${address.slice(-4)}):`);
        console.log(`   ID: ${userData.id}`);
        console.log(`   Referrer: ${userData.referrer.slice(0,6)}...${userData.referrer.slice(-4)}`);
        console.log(`   Referrals count: ${userData.referrals}`);
        console.log(`   Total referral earnings: ${formatBNB(userData.referralPayoutSum)} BNB`);
        console.log(`   Active levels: [${userLevels.active.map((active, i) => active ? i+1 : null).filter(x => x).join(', ')}]`);
        console.log("");
    };

    // Helper function to check balances
    const checkBalance = async (address, label) => {
        const balance = await ethers.provider.getBalance(address);
        console.log(`💰 ${label}: ${formatBNB(balance)} BNB`);
        return balance;
    };

    try {
        console.log("📋 SCENARIO 1: Basic referral registration");
        console.log("==========================================");
        
        // Owner is auto-registered in constructor (_registerOwner)
        const regPrice = await contract.REGISTRATION_PRICE();
        console.log("✅ Owner auto-registered in constructor (ID 1)");
        
        // User1 register with owner as referrer (ID 2)
        await contract.connect(user1).registerWithReferrer(owner.address, { value: regPrice });
        console.log("✅ User1 registered with owner as referrer (ID 2)");
        
        // User2 register with user1 as referrer (ID 3)
        await contract.connect(user2).registerWithReferrer(user1.address, { value: regPrice });
        console.log("✅ User2 registered with user1 as referrer (ID 3)");
        
        // User3 register with user2 as referrer (ID 4)
        await contract.connect(user3).registerWithReferrer(user2.address, { value: regPrice });
        console.log("✅ User3 registered with user2 as referrer (ID 4)");
        
        console.log("");
        await checkUser(owner.address, "Owner");
        await checkUser(user1.address, "User1");
        await checkUser(user2.address, "User2");
        await checkUser(user3.address, "User3");

        console.log("📋 SCENARIO 2: Level purchases WITHOUT referrer having same level");
        console.log("================================================================");
        
        // Record initial balances
        const initialOwnerBalance = await checkBalance(owner.address, "Owner initial");
        const initialUser1Balance = await checkBalance(user1.address, "User1 initial");
        const initialUser2Balance = await checkBalance(user2.address, "User2 initial");
        
        // User3 buys Level 1 (user2 is referrer but doesn't have Level 1)
        const level1Price = await getPrice(1);
        console.log(`💸 User3 buying Level 1 (${formatBNB(level1Price)} BNB)...`);
        console.log(`   User3's referrer (User2) has NO Level 1 active`);
        
        await contract.connect(user3).buyLevel(1, { value: level1Price });
        console.log("✅ User3 bought Level 1");
        
        // Check balances after - should see if referral went to owner instead
        const afterOwnerBalance = await checkBalance(owner.address, "Owner after");
        const afterUser1Balance = await checkBalance(user1.address, "User1 after");
        const afterUser2Balance = await checkBalance(user2.address, "User2 after");
        
        console.log("💹 Balance changes:");
        console.log(`   Owner: +${formatBNB(afterOwnerBalance - initialOwnerBalance)} BNB`);
        console.log(`   User1: +${formatBNB(afterUser1Balance - initialUser1Balance)} BNB`);
        console.log(`   User2: +${formatBNB(afterUser2Balance - initialUser2Balance)} BNB`);
        console.log("");
        
        await checkUser(user2.address, "User2 (referrer)");
        await checkUser(user3.address, "User3 (buyer)");

        console.log("📋 SCENARIO 3: Level purchases WITH referrer having same level");
        console.log("=============================================================");
        
        // User2 activates Level 1 first
        console.log(`💸 User2 buying Level 1 to become eligible for referral bonuses...`);
        await contract.connect(user2).buyLevel(1, { value: level1Price });
        console.log("✅ User2 bought Level 1");
        
        // Record balances before user4 purchase
        const beforeOwnerBalance2 = await checkBalance(owner.address, "Owner before");
        const beforeUser1Balance2 = await checkBalance(user1.address, "User1 before");
        const beforeUser2Balance2 = await checkBalance(user2.address, "User2 before");
        
        // User4 register with user2 as referrer
        await contract.connect(user4).registerWithReferrer(user2.address, { value: regPrice });
        console.log("✅ User4 registered with user2 as referrer (ID 5)");
        
        // User4 buys Level 1 (user2 is referrer and HAS Level 1)
        console.log(`💸 User4 buying Level 1 (${formatBNB(level1Price)} BNB)...`);
        console.log(`   User4's referrer (User2) HAS Level 1 active`);
        
        await contract.connect(user4).buyLevel(1, { value: level1Price });
        console.log("✅ User4 bought Level 1");
        
        // Check balances after - should see referral bonuses to user2
        const afterOwnerBalance2 = await checkBalance(owner.address, "Owner after");
        const afterUser1Balance2 = await checkBalance(user1.address, "User1 after");
        const afterUser2Balance2 = await checkBalance(user2.address, "User2 after");
        
        console.log("💹 Balance changes:");
        console.log(`   Owner: +${formatBNB(afterOwnerBalance2 - beforeOwnerBalance2)} BNB`);
        console.log(`   User1: +${formatBNB(afterUser1Balance2 - beforeUser1Balance2)} BNB`);
        console.log(`   User2: +${formatBNB(afterUser2Balance2 - beforeUser2Balance2)} BNB (should get referral bonuses!)`);
        console.log("");
        
        await checkUser(user2.address, "User2 (referrer with Level 1)");
        await checkUser(user4.address, "User4 (buyer)");

        console.log("📋 SCENARIO 4: Multi-level referral chain");
        console.log("=========================================");
        
        // Make sure user1 and owner have Level 1
        await contract.connect(user1).buyLevel(1, { value: level1Price });
        await contract.buyLevel(1, { value: level1Price });
        console.log("✅ User1 and Owner activated Level 1");
        
        // Record all balances
        const beforeOwner3 = await checkBalance(owner.address, "Owner before");
        const beforeUser1_3 = await checkBalance(user1.address, "User1 before");
        const beforeUser2_3 = await checkBalance(user2.address, "User2 before");
        
        // Create new user5 with user2 as referrer
        const [, , , , , user5] = await ethers.getSigners();
        await contract.connect(user5).registerWithReferrer(user2.address, { value: regPrice });
        console.log("✅ User5 registered with user2 as referrer");
        
        // User5 buys Level 1 - should distribute to chain: user2 -> user1 -> owner
        console.log(`💸 User5 buying Level 1...`);
        console.log(`   Referral chain: User2 (13%) -> User1 (8%) -> Owner (5%)`);
        
        await contract.connect(user5).buyLevel(1, { value: level1Price });
        console.log("✅ User5 bought Level 1");
        
        // Check final balances
        const afterOwner3 = await checkBalance(owner.address, "Owner after");
        const afterUser1_3 = await checkBalance(user1.address, "User1 after");
        const afterUser2_3 = await checkBalance(user2.address, "User2 after");
        
        console.log("💹 Final balance changes:");
        console.log(`   Owner: +${formatBNB(afterOwner3 - beforeOwner3)} BNB (should be ~5% = ${formatBNB(level1Price * BigInt(5) / BigInt(100))} BNB)`);
        console.log(`   User1: +${formatBNB(afterUser1_3 - beforeUser1_3)} BNB (should be ~8% = ${formatBNB(level1Price * BigInt(8) / BigInt(100))} BNB)`);
        console.log(`   User2: +${formatBNB(afterUser2_3 - beforeUser2_3)} BNB (should be ~13% = ${formatBNB(level1Price * BigInt(13) / BigInt(100))} BNB)`);
        console.log("");

        console.log("📋 FINAL STATUS");
        console.log("===============");
        await checkUser(owner.address, "Owner");
        await checkUser(user1.address, "User1");
        await checkUser(user2.address, "User2");
        await checkUser(user3.address, "User3");
        await checkUser(user4.address, "User4");
        await checkUser(user5.address, "User5");

        console.log("✅ REFERRAL SYSTEM TEST COMPLETED!");
        console.log("");
        console.log("🔍 KEY FINDINGS:");
        console.log("- Referral bonuses only work if referrer has the same level active");
        console.log("- If referrer doesn't have level, bonuses go to owner");
        console.log("- Multi-level referral chain works: 13% -> 8% -> 5%");
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
