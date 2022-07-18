import { EventCreated, QrCodeClaimed } from "../generated/EventManager/EventManager"
import { CreatedEvent, QrCodeClaimed as QrCodeClaimedEntity } from "../generated/schema"
import { Bytes, ipfs, json, log } from "@graphprotocol/graph-ts"

export function handleEventCreated(event: EventCreated): void {
  const id = event.params.eventAddress.toHexString();
  const entity = new CreatedEvent(id);
  entity.creatorAddress = event.transaction.from;

  const cid = event.params.eventURI.substring(8, 67);
  entity.cid = cid;

  const ipfsData = ipfs.cat(cid);
  if (ipfsData === null) {
    log.error("Can't read IPFS data for event {}", [id]);
    return;
  }

  const jsonData = json.fromBytes(ipfsData).toObject();

  entity.name = jsonData.get("name")!.toString();
  entity.description = jsonData.get("description")!.toString();
  entity.image = jsonData.get("image")!.toString();
  entity.isOnline = jsonData.get("isOnline")!.toBool();
  entity.location = jsonData.get("location")!.toString();
  entity.startDate = jsonData.get("startDate")!.toString();
  entity.endDate = jsonData.get("endDate")!.toString();
  entity.organiserEmail = jsonData.get("organiserEmail")!.toString();
  entity.ticketCount = jsonData.get("ticketCount")!.toBigInt();
  entity.ticketPrice = jsonData.get("ticketPrice")!.toString();
  entity.ticketCurrency = Bytes.fromHexString(jsonData.get("ticketCurrency")!.toString());
  entity.royaltyPercentage = jsonData.get("royaltyPercentage")!.toI64() as i32;
  entity.distributePoaps = jsonData.get("distributePoaps")!.toBool();

  entity.save();
}

export function handleQrCodeClaimed(event: QrCodeClaimed): void {
  const entity = new QrCodeClaimedEntity(event.params.qrCodeId);
  entity.eventAddress = event.params.eventAddress;
  entity.tokenId = event.params.tokenId;
  entity.blockNumber = event.block.number;

  entity.save();
}
