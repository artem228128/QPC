import { expect } from "chai";
import { ethers } from "hardhat";

describe("Payouts with Level 2 active (infinite cycles)", () => {
  it("user2 (after owner) should be able to exceed maxPayouts on L1 when L2 is active", async () => {
    const ImprovedMLM = await ethers.getContractFactory("ImprovedMLM_BSC");
    // Constructor expects tokenBurner address; use owner for simplicity
    const [deployer, user1, user2, ...rest] = await ethers.getSigners();
    const contract = await ImprovedMLM.deploy(await deployer.getAddress());
    await contract.waitForDeployment();
    const owner = deployer;

    // Register user1 (2nd participant) and user2 (3rd)
    await contract.connect(user1).registerWithReferrer(await owner.getAddress(), { value: ethers.parseEther("0.025") });
    await contract.connect(user2).registerWithReferrer(await user1.getAddress(), { value: ethers.parseEther("0.025") });

    // Activate Level 2 for user1 (so L1 has infinite cycles)
    const level2Price = await contract.levelPrices(2);
    await contract.connect(user1).buyLevel(2, { value: level2Price });

    // Now simulate 10 new registrations that each buy L1 implicitly on registration
    for (let i = 0; i < 10; i++) {
      const acc = rest[i];
      await contract.connect(acc).registerWithReferrer(await user2.getAddress(), { value: ethers.parseEther("0.025") });
    }

    const levels = await contract.getUserLevels(await user1.getAddress());
    const payoutsL1 = Number(levels.payouts[1]);
    const maxPayoutsL1 = Number(levels.maxPayouts[1]);
    const isFrozenL1 = await contract.isLevelFrozen(await user1.getAddress(), 1);

    // With L2 active, user1 should not be frozen even if payouts exceed maxPayouts
    expect(levels.active[2]).to.eq(true);
    expect(payoutsL1).to.be.greaterThan(0);
    expect(payoutsL1).to.be.greaterThanOrEqual(maxPayoutsL1); // potentially exceed 2
    expect(isFrozenL1).to.eq(false);
  });
});


