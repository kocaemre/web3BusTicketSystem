import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    // Contract constructor arguments
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  await yourContract.addBusTicket("Istanbul", "Ankara", "10 July 10:30", "3:00", hre.ethers.parseEther("0.001"), 30);
  await yourContract.addBusTicket("Milano", "Torino", "10 July 14:30", "5:00", hre.ethers.parseEther("0.001"), 30);
  await yourContract.addBusTicket("Paris", "Calais", "10 July 15:50", "2:00", hre.ethers.parseEther("0.001"), 30);

  await yourContract.transferOwnership("0x2787b58E6c7c9e0C824f2187BA99a2076B23491c");
  await yourContract.bookTicket(5, 0, { value: hre.ethers.parseEther("0.001") });
  await yourContract.bookTicket(8, 1, { value: hre.ethers.parseEther("0.001") });
  await yourContract.bookTicket(13, 2, { value: hre.ethers.parseEther("0.001") });
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
