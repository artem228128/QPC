const { ethers } = require("hardhat");

async function main() {
    console.log("🔄 Quick Referral Test");
    
    // Deploy contract
    const [owner, user1, user2] = await ethers.getSigners();
    
    const Contract = await ethers.getContractFactory("ImprovedMLM_BSC");
    const contract = await Contract.deploy(owner.address);
    await contract.waitForDeployment();
    
    console.log("Contract deployed");

    // Register users
    const regPrice = await contract.REGISTRATION_PRICE();
    
    // Owner register
    await contract.register({ value: regPrice });
    console.log("✅ Owner registered (ID 1)");
    
    // User1 register with owner as referrer
    await contract.connect(user1).registerWithReferrer(owner.address, { value: regPrice });
    console.log("✅ User1 registered with owner referrer (ID 2)");
    
    // Check user1 data
    const user1Data = await contract.getUser(user1.address);
    console.log(`User1 referrer: ${user1Data.referrer}`);
    console.log(`Owner address: ${owner.address}`);
    console.log(`Referrer matches owner: ${user1Data.referrer === owner.address}`);
    
    // Test Level 1 purchase WITHOUT owner having Level 1
    console.log("\n📋 Test 1: User1 buys Level 1, Owner has NO Level 1");
    
    const level1Price = await contract.getLevelPrice(1);
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    
    await contract.connect(user1).buyLevel(1, { value: level1Price });
    console.log("✅ User1 bought Level 1");
    
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    const ownerEarned = ownerBalanceAfter - ownerBalanceBefore;
    
    console.log(`Owner balance change: ${ethers.formatEther(ownerEarned)} BNB`);
    
    // Check owner's referral earnings
    const ownerDataAfter = await contract.getUser(owner.address);
    console.log(`Owner referral earnings: ${ethers.formatEther(ownerDataAfter.referralPayoutSum)} BNB`);
    
    // Test Level 1 purchase WITH owner having Level 1
    console.log("\n📋 Test 2: User1 buys Level 1 again, Owner HAS Level 1");
    
    // Owner activates Level 1
    await contract.buyLevel(1, { value: level1Price });
    console.log("✅ Owner activated Level 1");
    
    // User2 registers and buys Level 1
    await contract.connect(user2).registerWithReferrer(owner.address, { value: regPrice });
    console.log("✅ User2 registered with owner referrer");
    
    const ownerBalanceBefore2 = await ethers.provider.getBalance(owner.address);
    
    await contract.connect(user2).buyLevel(1, { value: level1Price });
    console.log("✅ User2 bought Level 1");
    
    const ownerBalanceAfter2 = await ethers.provider.getBalance(owner.address);
    const ownerEarned2 = ownerBalanceAfter2 - ownerBalanceBefore2;
    
    console.log(`Owner balance change: ${ethers.formatEther(ownerEarned2)} BNB`);
    
    // Check final owner's referral earnings
    const ownerDataFinal = await contract.getUser(owner.address);
    console.log(`Owner total referral earnings: ${ethers.formatEther(ownerDataFinal.referralPayoutSum)} BNB`);
    console.log(`Owner referrals count: ${ownerDataFinal.referrals}`);
    
    console.log("\n✅ Test completed!");
}

main().catch(console.error);
