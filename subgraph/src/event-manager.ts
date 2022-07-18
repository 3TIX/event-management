import { EventCreated, QrCodeClaimed } from "../generated/EventManager/EventManager"
import { QrCodeClaimed as QrCodeClaimedEntity } from "../generated/schema"


export function handleEventCreated(event: EventCreated): void {
}

export function handleQrCodeClaimed(event: QrCodeClaimed): void {
  const entity = new QrCodeClaimedEntity(event.params.qrCodeId);
  entity.eventAddress = event.params.eventAddress;
  entity.tokenId = event.params.tokenId;
  entity.blockNumber = event.block.number;

  entity.save();
}
