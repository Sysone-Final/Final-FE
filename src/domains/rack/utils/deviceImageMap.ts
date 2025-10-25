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
  server: { front: serverFrontImg, back: serverBackImg },
  storage: { front: storageFrontImg, back: StorageBackImg },
  switch: { front: switchFrontImg, back: switchBackImg },
  router: { front: routerFrontImg, back: routerBackImg },
  kvm: { front: kvmFrontImg, back: kvmBackImg },
  firewall: { front: firewallFrontImg, back: firewallBackImg },
  loadbalancer: { front: loadBalanceFrontImg, back: loadBalanceBackImg },
};
