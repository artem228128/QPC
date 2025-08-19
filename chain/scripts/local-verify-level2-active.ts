import { ethers } from "hardhat";

async function main() {
  console.log("\n=== Local verify: Level2 active, Level1 payouts under 10 L1 purchases ===\n");

  const [deployer, user1, user2, ...rest] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory("ImprovedMLM_BSC");
  const contract = await Factory.deploy(await deployer.getAddress());
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log("Deployed at:", addr);

  // Helper to get price for a level
  const price = async (lvl: number) => (await (contract as any).levelPrices(lvl)) as bigint;

  // 1) Register user1 (2nd participant after owner) and buy L1 + L2
  await (contract as any)
    .connect(user1)
    .registerWithReferrer(await deployer.getAddress(), { value: ethers.parseEther("0.025") });
  await (contract as any)
    .connect(user1)
    .buyLevel(1, { value: await price(1) });
  await (contract as any)
    .connect(user1)
    .buyLevel(2, { value: await price(2) });
  console.log("User1 registered and bought L1 + L2 (Level2 active)\n");

  // 2) Register user2 (3rd participant) and buy L1
  await (contract as any)
    .connect(user2)
    .registerWithReferrer(await user1.getAddress(), { value: ethers.parseEther("0.025") });
  await (contract as any)
    .connect(user2)
    .buyLevel(1, { value: await price(1) });
  console.log("User2 registered and bought L1\n");

  // 3) Perform 10 L1 purchases by new users (each must register first)
  for (let i = 0; i < 10; i++) {
    const acc = rest[i];
    await (contract as any)
      .connect(acc)
      .registerWithReferrer(await user2.getAddress(), { value: ethers.parseEther("0.025") });
    await (contract as any)
      .connect(acc)
      .buyLevel(1, { value: await price(1) });
    if ((i + 1) % 1 === 0) {
      const levels = await (contract as any).getUserLevels(await user1.getAddress());
      console.log(
        `After ${i + 1} L1 purchases: user1 L1 payouts=${Number(levels.payouts[1])}, max=${Number(
          levels.maxPayouts[1]
        )}`
      );
    }
  }

  const levelsFinal = await (contract as any).getUserLevels(await user1.getAddress());
  const payoutsL1 = Number(levelsFinal.payouts[1]);
  const maxPayoutsL1 = Number(levelsFinal.maxPayouts[1]);
  const frozenL1 = await (contract as any).isLevelFrozen(await user1.getAddress(), 1);

  console.log("\n=== Final ===");
  console.log("User1 L1 payouts:", payoutsL1);
  console.log("User1 L1 maxPayouts:", maxPayoutsL1);
  console.log("User1 L1 frozen:", frozenL1);
  console.log("Level2 active:", levelsFinal.active[2]);

  console.log("\nInterpretation:");
  console.log("- With Level2 active, L1 should continue (not frozen) even if payouts > maxPayouts");
  console.log("- The absolute payout count depends on queue rotation (owner in queue from start)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


