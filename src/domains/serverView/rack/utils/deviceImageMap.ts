import serverFrontImg from "../assets/serverFront.png";
import serverBackImg from "../assets/serverBack.png";
import storageFrontImg from "../assets/storageFront.png";
import switchFrontImg from "../assets/switchFront.png";
import switchBackImg from "../assets/switchBack.png";
import routerFrontImg from "../assets/routerFront.png";
import kvmFrontImg from "../assets/kvmFront.png";
import kvmBackImg from "../assets/kvmBack.png";
import firewallFrontImg from "../assets/firewallFront.png";
import firewallBackImg from "../assets/firewallBack.png";
import loadBalanceFrontImg from "../assets/loadbalanceFront.png";
import loadBalanceBackImg from "../assets/loadbalanceBack.png";
import routerBackImg from "../assets/routerBack.png";
import StorageBackImg from "../assets/storageBack.png";

export const deviceImageMap: Record<string, { front: string; back: string }> = {
  SERVER: { front: serverFrontImg, back: serverBackImg },
  STORAGE: { front: storageFrontImg, back: StorageBackImg },
  SWITCH: { front: switchFrontImg, back: switchBackImg },
  ROUTER: { front: routerFrontImg, back: routerBackImg },
  KVM: { front: kvmFrontImg, back: kvmBackImg },
  FIREWALL: { front: firewallFrontImg, back: firewallBackImg },
  LOAD_BALANCER: { front: loadBalanceFrontImg, back: loadBalanceBackImg },
};
