import { ethers } from "hardhat";

async function main() {
  const tokenBurner = process.env.TOKEN_BURNER || ethers.ZeroAddress;
  if (tokenBurner === ethers.ZeroAddress) {
    throw new Error("Please set TOKEN_BURNER env var");
  }

  const Factory = await ethers.getContractFactory("ImprovedMLM_BSC");
  const contract = await Factory.deploy(tokenBurner as any);
  await contract.waitForDeployment();
  console.log("ImprovedMLM_BSC deployed to:", await contract.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

