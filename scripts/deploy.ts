import { ethers, network } from "hardhat";
import { verify } from "../utils/verify";

async function main() {
  const Delphya = await ethers.getContractFactory("Delphya")
  const delphya = await Delphya.deploy()
  await delphya.deployed()
  console.log("Deployed Smart Contract at address", delphya.address)

  if (network.name === "goerli") {
    console.log("Verifying the Smart Contract ERC20...")
    await delphya.deployTransaction.wait(6) // Attendre 6 block après le déploiment
    await verify(delphya.address, [])
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
