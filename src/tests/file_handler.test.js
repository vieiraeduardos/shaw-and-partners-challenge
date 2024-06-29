import { test, expect, afterEach } from "vitest";

import { FileHandler } from "../handlers/file_handler";

test("Create db", async () => {
    const fh = new FileHandler();

    const header = ["NAME", "SURNAME", "AGE"];

    const result = await fh.create_table(header);

    expect(result).toBe("Table created successfully");

    await fh.delete_table();
});

test("Insert items to db", async () => {
    const fh = new FileHandler();

    const header = ["NAME", "SURNAME", "AGE"];
    const lines = ["NAME;SURNAME;AGE", "EDUARDO;SILVA;27"];
    await fh.create_table(header);
    const result = await fh.insert_values(lines);

    expect(result).toBe("Items inserted successfully");

    await fh.delete_table();
});

test("Select items from db", async () => {
    const fh = new FileHandler();

    const header = ["NAME", "SURNAME", "AGE"];
    const lines = ["NAME;SURNAME;AGE", "EDUARDO;SILVA;27", "JANE;DOE;27"];
    await fh.create_table(header);
    await fh.insert_values(lines);

    const result = await fh.search_values("Eduardo");

    expect(result.length).toBe(1);

    await fh.delete_table();
});

test("Exception NO SUCH TABLE when select items from db", async () => {
    const fh = new FileHandler();
    const header = ["NAME", "SURNAME", "AGE"];
    const lines = ["NAME;SURNAME;AGE", "EDUARDO;SILVA;27", "JANE;DOE;27"];
    fh.HEADER = header;

    try {
        await fh.delete_table();

        const result = await fh.search_values("Eduardo");
        expect(result.length).toBe(0)

    } catch (err) {
        expect(String(err)).toBe("Error: SQLITE_ERROR: no such table: JOKE");
    };

    await fh.delete_table();
});


test("Exception NO SUCH TABLE when select items from db", async () => {
    const fh = new FileHandler();
    const header = ["NAME", "SURNAME", "AGE"];
    const lines = ["NAME;SURNAME;AGE", "EDUARDO;SILVA;27", "JANE;DOE;27"];

    await fh.delete_table();

    const result = await fh.search_values("Eduardo");
    expect(result.length).toBe(0)

    await fh.delete_table();
});
