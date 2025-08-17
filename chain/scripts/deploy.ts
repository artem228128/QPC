import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const fallbackBurner = await deployer.getAddress();
  const envBurner = process.env.TOKEN_BURNER;
  const tokenBurner = envBurner && envBurner !== "" ? envBurner : fallbackBurner;

  console.log("Deployer:", fallbackBurner);
  console.log("TokenBurner:", tokenBurner);

  const Factory = await ethers.getContractFactory("ImprovedMLM_BSC");
  const contract = await Factory.deploy(tokenBurner as any);
  await contract.waitForDeployment();
  console.log("ImprovedMLM_BSC deployed to:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

