import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage/", async (req: Request, res: Response) => {
    const imageuUrl: string = req.query.image_url as string;
    if (!imageuUrl)
      return res.status(400).send("Image url is missing");

    if (!/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(imageuUrl))
      return res.status(400).send("Invalid image url");

    const filteredPath = await filterImageFromURL(imageuUrl);
    res.sendFile(filteredPath);
    res.on("finish", () => deleteLocalFiles([filteredPath]));
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();