import { Link } from "react-router-dom";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { providers } from "ethers";
import { selectNotificationStatus } from "state/selectors";
import { setAppState, AppNotificationStatus, TxnStatus } from "state/app";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LeftOutlined from "@mui/icons-material/KeyboardArrowLeftRounded";
import typography from "@klimadao/lib/theme/typography";
import classNames from "classnames";
import T from "@klimadao/lib/theme/typography.module.css";

import {
  changeApprovalTransaction,
  changeStakeTransaction,
} from "actions/stake";
import { useAppDispatch } from "state";
import { incrementStake, decrementStake, setStakeAllowance } from "state/user";
import {
  selectAppState,
  selectBalances,
  selectStakeAllowance,
} from "state/selectors";

import {
  Spinner,
  TextInfoTooltip,
  useTooltipSingleton,
} from "@klimadao/lib/components";
import {
  secondsUntilBlock,
  trimWithPlaceholder,
  concatAddress,
} from "@klimadao/lib/utils";
import t from "@klimadao/lib/theme/typography.module.css";
import styles from "./index.module.css";
import { Trans } from "@lingui/macro";
import { prettifySeconds } from "lib/i18n";

const WithPlaceholder: FC<{
  condition: boolean;
  placeholder: string;
}> = (props) => {
  if (props.condition) {
    return <>{props.placeholder}</>;
  }
  return <>{props.children}</>;
};

interface Props {
  provider: providers.JsonRpcProvider;
  address?: string;
  isConnected: boolean;
}

export const FairyCreek = (props: Props) => {
  const { provider, address, isConnected } = props;
  const dispatch = useAppDispatch();
  const [view, setView] = useState("conserve");
  const fullStatus: AppNotificationStatus | null = useSelector(
    selectNotificationStatus
  );
  const status = fullStatus && fullStatus.statusType;

  const setStatus = (statusType: TxnStatus | null, message?: string) => {
    if (!statusType) return dispatch(setAppState({ notificationStatus: null }));
    dispatch(setAppState({ notificationStatus: { statusType, message } }));
  };

  const [quantity, setQuantity] = useState("");
  const [singletonSource, singleton] = useTooltipSingleton();

  const {
    fairycreekfundsraised
  } = useSelector(selectAppState);

  return (
    <div className={styles.conserveCard}>
      <Link
          to="/conserve/vote"
          className={classNames(
            typography.button,
            styles.bondHeader_backButton
          )}
        >
          <LeftOutlined />
          <Trans id="nav.back">BACK</Trans>
        </Link>
        Vote to conserve and regenerate Fairy Creek.<br/>
        Funds will go to buying logging tenure, and setting up a stewardship tenure in partnership with the local Indiginous Nation.
        <br/><br/>
        Project id: 0<br/>
        Funding threshold: 1000000 wei<br/>
        Funding raised: {fairycreekfundsraised} wei<br/>
        <a target="_blank" href="https://vouchers-tool.netlify.app/marketplace">
            <div className={styles.bondLink} key={34324}>
              <div>
                <h3 className={T.subtitle2}>View 3D rendering</h3>
                <p
                  className={classNames(styles.bondLink_description, T.caption)}
                >
                </p>s
              </div>

            </div>
          </a><br/>
        <h2><b>Vote</b></h2>
        Amount of CTR to vote with: <br/>
        <div className={styles.inputsContainer}>
      <input
            className={styles.stakeInput_input}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            placeholder={`0`}
            min="0"
      />
      Amount in wei: ...<br/>
      <button type="button" >Submit</button>
      </div>

    </div>
  );
};
