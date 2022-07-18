import { NFTStorage, File } from "nft.storage"

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIwMzdlM0M4OWRjMGMyZDEwOTc4NkM2ZjJFNjlBYzY3NTlFZjM1NjciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1ODE2MDg1OTYxNiwibmFtZSI6IjNUSVgifQ.2EL8CAKCWvUB6q5CQgTaHgh1nS7kKWHAtJ78T4c489U"

export const uploadJSON = async (object: unknown) => {
  const type = "application/json"
  const fileEntity = new File([JSON.stringify(object)], "/", { type })
  const nftstorage = new NFTStorage({ token: API_KEY })
  return nftstorage.storeBlob(fileEntity)
}
