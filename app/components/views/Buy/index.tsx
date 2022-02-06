import { Link } from "react-router-dom";
import React, { useState, useEffect, FC, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { providers } from "ethers";
import { selectNotificationStatus } from "state/selectors";
import { setAppState, AppNotificationStatus, TxnStatus } from "state/app";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LeftOutlined from "@mui/icons-material/KeyboardArrowLeftRounded";
import typography from "@klimadao/lib/theme/typography";
import classNames from "classnames";
import { getJsonRpcProvider } from "../../../../lib/utils/getJsonRpcProvider";

import {
  buyCTR
} from "actions/buy";
import { useAppDispatch } from "state";
import {
  selectAppState
} from "state/selectors";


import styles from "./index.module.css";
import { Trans } from "@lingui/macro";


interface Props {
  provider: providers.JsonRpcProvider;
  address?: string;
  isConnected?: boolean;
}

export const Buy: FC<Props> = (props) => {
  const [quantity, setQuantity] = useState("");
  const { provider, address, isConnected } = props;
  const dispatch = useAppDispatch();
  const fullStatus: AppNotificationStatus | null = useSelector(
    selectNotificationStatus
  );
  const status = fullStatus && fullStatus.statusType;

  const setStatus = (statusType: TxnStatus | null, message?: string) => {
    if (!statusType) return dispatch(setAppState({ notificationStatus: null }));
    dispatch(setAppState({ notificationStatus: { statusType, message } }));
  };

  const {
    ctrPrice, 
    currentIndex
  } = useSelector(selectAppState);

  //const balances = useSelector(selectBalances);


  const handleBuy = async () => {
    try {
      const provider = getJsonRpcProvider();
      const signer = provider.getSigner();
      await buyCTR({
        value: quantity,
        provider: props.provider,
        address: props.address,
        onStatus: setStatus,
      });
    } catch (error) {
      alert(error);
    }
  };


  return (
    <div className={styles.conserveCard}>
      <Link
          to="/conserve"
          className={classNames(
            typography.button,
            styles.bondHeader_backButton
          )}
        >
          <LeftOutlined />
          <Trans id="nav.back">BACK</Trans>
        </Link>
      CTR price: {ctrPrice} wei<br/><br/>
      Amount of CTR to buy

      <div className={styles.inputsContainer}>
      <input
            className={styles.stakeInput_input}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            placeholder={`0`}
            min="0"
      />
      <button type="button" onClick={handleBuy}>Submit</button>
      </div>

      
    </div>
  );
};
