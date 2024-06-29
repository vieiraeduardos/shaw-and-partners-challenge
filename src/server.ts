import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { FileHandler } from "./handlers/file_handler";

const server = fastify();

server.register(fastifyMultipart);

const SEPARATOR: string = ";";

const fh = new FileHandler();

server.post("/files", async function (request, reply) {
    const formData = await request.file();

    if (!formData) {
        reply.status(400).send("No form data received.");
        return;
    }

    const content = (await formData.toBuffer()).toString();
    const lines = content.split("\n");
    const header = lines[0].split(SEPARATOR).map((header) => header.replace(/\r/g, ''));

    await fh.create_table(header);
    await fh.insert_values(lines);

    reply.send("OK");
});

server.get("/files", async (request, reply) => {
    const query: { value: string } = request.query as { value: string };

    let value = "";
    
    if (query.value) {
        value = query.value;
    }

    const result = await fh.search_values(value);

    reply.send(result);

});


server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
