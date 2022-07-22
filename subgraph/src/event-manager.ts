import { EventCreated, QrCodeClaimed } from "../generated/EventManager/EventManager"
import { CreatedEvent, QrCodeClaimed as QrCodeClaimedEntity } from "../generated/schema"
import { Bytes, ipfs, json, log } from "@graphprotocol/graph-ts"

export function handleEventCreated(event: EventCreated): void {
  const id = event.params.eventAddress.toHexString();
  const entity = new CreatedEvent(id);
  entity.blockNumber = event.block.number;
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
  entity.startDate = parseInt(jsonData.get("startDate")!.toString()) as i32;
  entity.endDate = parseInt(jsonData.get("endDate")!.toString()) as i32;
  entity.organiserEmail = jsonData.get("organiserEmail")!.toString();
  entity.ticketCount = jsonData.get("ticketCount")!.toU64() as i32;
  entity.ticketPrice = jsonData.get("ticketPrice")!.toString();
  entity.ticketCurrency = Bytes.fromHexString(jsonData.get("ticketCurrency")!.toString());
  entity.royaltyPercentage = jsonData.get("royaltyPercentage")!.toI64() as i32;
  entity.distributePoaps = jsonData.get("distributePoaps")!.toBool();

  entity.save();
}

export function handleQrCodeClaimed(event: QrCodeClaimed): void {
  const entity = new QrCodeClaimedEntity(event.params.qrCodeId);
  entity.eventAddress = event.params.eventAddress;
  entity.event = event.params.eventAddress.toHexString();
  entity.tokenId = event.params.tokenId;
  entity.blockNumber = event.block.number;

  entity.save();
}
