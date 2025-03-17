const fs = require("fs");
const csv = require("fast-csv");
const Book = require("../models/Book");

exports.bulkImportBooksCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const filePath = req.file.path;
        const booksToInsert = [];
        const duplicateEntries = [];
        const errorEntries = [];

        // Fetch existing books for duplicate checking
        const existingBooks = await Book.find({}, "accessionNumber");
        const existingAccessionNumbers = new Set(existingBooks.map(book => book.accessionNumber));

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("error", (error) => {
                console.error("Error parsing CSV:", error);
                return res.status(500).json({ message: "Error processing file" });
            })
            .on("data", (row) => {
                const {
                    "Accession Number": accessionNumber,
                    "Author Name": authorName,
                    "Book Name": bookName,
                    "Publication": publication,
                    "Year": year,
                    "Total Pages": totalPages,
                    "Supplier": supplier,
                    "Price": price
                } = row;

                // Check for missing fields
                if (!accessionNumber || !authorName || !bookName || !publication || !year || !totalPages || !supplier || !price) {
                    errorEntries.push({
                        accessionNumber: accessionNumber || "Unknown",
                        error: "Missing required fields",
                    });
                    return;
                }

                // Check for duplicates
                if (existingAccessionNumbers.has(accessionNumber)) {
                    duplicateEntries.push({
                        accessionNumber,
                        error: "Duplicate Accession Number",
                    });
                    return;
                }

                // Add book to insert list
                booksToInsert.push({
                    accessionNumber,
                    authorName,
                    bookName,
                    publication,
                    year: Number(year),
                    totalPages: Number(totalPages),
                    supplier,
                    price: Number(price),
                    addedBy: req.user._id,
                });

                existingAccessionNumbers.add(accessionNumber);
            })
            .on("end", async () => {
                let insertedCount = 0;

                if (booksToInsert.length > 0) {
                    const insertedBooks = await Book.insertMany(booksToInsert, { ordered: false });
                    insertedCount = insertedBooks.length;
                }

                fs.unlinkSync(filePath);

                res.status(201).json({
                    message: "Bulk import completed!",
                    inserted: insertedCount,
                    duplicates: duplicateEntries.length,
                    errors: errorEntries.length,
                    duplicateEntries,
                    errorEntries,
                });
            });
    } catch (error) {
        console.error("Error importing books:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({}).select("-__v"); // Fetch all books and exclude the __v field
        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
