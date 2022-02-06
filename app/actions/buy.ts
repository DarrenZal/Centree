import { ethers, providers } from "ethers";
import { Thunk } from "state";
import { OnStatusHandler } from "./utils";
import Centree from "@klimadao/lib/abi/Centree.json";

export const get_CTR_price = async (params: {
  provider: providers.JsonRpcProvider;
  onStatus: OnStatusHandler;
}) => {
  alert("start");
  const signer = params.provider.getSigner();
  const contractAddress = "0x57E99cBB69FBBd90d671f5EaBddc984D2402836E";
  const contract = new ethers.Contract(contractAddress, Centree.abi, signer);
  const ctrPrice = await contract.ctr_price();
  alert(ctrPrice);
  return ctrPrice;
};

export const buyCTR = async (params: {
  value: string;
  address: string;
  provider: providers.JsonRpcProvider;
  onStatus: OnStatusHandler;
}) => {
  try {
    const signer = params.provider.getSigner();
    const contractAddress = "0x57E99cBB69FBBd90d671f5EaBddc984D2402836E";
    const contract = new ethers.Contract(contractAddress, Centree.abi, signer);
    const valueInWei = ethers.utils.parseUnits(params.value, "ether");
    params.onStatus("userConfirmation", "");
    const txn = await contract.buyCTR(params.address, {
      gasPrice: ethers.utils.parseUnits("100", "gwei"),
      gasLimit: "99000",
      value: ethers.utils.parseEther("0.001"),
    });
    params.onStatus("networkConfirmation", "");
    await txn.wait(1);
    params.onStatus("done", "Bought CTR successfully");
  } catch (error: any) {
    if (error.code === 4001) {
      params.onStatus("error", "userRejected");
      throw error;
    }
    params.onStatus("error");
    throw error;
  }
};
