import { ethers } from "ethers";
import vionaToken from "../VionaToken.json";
import smartcontract from "../SmartContract.json";

export const mint = async () => {

  const contractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  const NFTContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("ChainId : "+(await provider.getNetwork()).chainId);
  const signer = provider.getSigner();
  const address = signer.getAddress();
  const contract = new ethers.Contract(
    contractAddress,
    vionaToken.abi,
    signer
  );

  const NFTContract = new ethers.Contract(
    NFTContractAddress,
    smartcontract.abi,
    signer
  )
  
  const decimals = await contract.decimals();
  const balance = await contract.balanceOf(address);
  const allowance = await contract.allowance(address, NFTContractAddress);
  const price = await NFTContract.price();

  console.log(signer.getAddress());
  try {
    if(allowance <= price){
      if(balance <= price){
          alert("You don't have enough VYO balance");
      }else{
          contract.approve(
              NFTContractAddress,
              price
          ).then(async (trx) => {
              await trx.wait();
              const mint = await NFTContract.publicSalesMint({gasLimit: 50000});
              console.log("Mint : ", mint);
              alert("Transaksi anda berhasil");
          }).catch((error) => {
              const message =  "Transaction failed with error code:" + error;
              alert(message);
              console.log(message)
          })
      }
  }
  } catch (error) {
    // handle error
    console.log(error);
  }
};
