import fs from "fs"
import crypto from "crypto"
import express from "express"

const app = express()

app.post("/upload", (req, res) => {
  const maxSize = Infinity
  let size = 0

  const random = crypto.randomBytes(2).toString("hex")
  const fileName = Date.now() + "_" + random + "." + req.get("file-extention")
  const writeStream = fs.createWriteStream("public/" + fileName, { flags: "a" })

  req.on("data", (chunk) => {
    size += chunk.length

    if (size > maxSize) {
      writeStream.end()
      return res
        .status(400)
        .send({ result: "File size should not exceed 1MB." })
    }

    writeStream.write(chunk)
  })

  req.on("end", async () => {
    writeStream.end()
    res.send({ result: "/" + fileName })
  })

  req.on("error", (e) => {
    console.error(e)
    res.status(500).send({ result: "Internal Server Error" })
  })
})

app.use(express.static("public"))

app.listen(3000, () => console.log("Express is listening on port 3000"))
