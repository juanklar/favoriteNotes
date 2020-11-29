/*  */
/*  */
const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.get("/note/add", (req, res) => {
  res.render("notes/add");
});

router.post("/note/add", async (req, res) => {
  const { title, description } = req.body;
  console.log(title, description); /*  */
  const errors = [];
  if (!title) {
    errors.push({ text: "Please write a title" });
  }
  if (!description) {
    errors.push({ text: "Please write a description" });
  }
  if (errors.length > 0) {
    res.render("notes/add", { errors, title, description });
  } else {
    /* crear nota */
    const newNote = new Note({ title, description });
    await newNote.save();
    res.redirect("/note");
  }
});

router.get("/note", async (req, res) => {
  /* try { */
  const noteList = await Note.find().sort({ date: "desc" }).lean();
  res.render("notes/list", { noteList });
  /* } catch (error) {
    console.log(error);
  } */
});

router.get("/note/edit/:id", async (req, res) => {
  const noteEdit = await Note.findById(req.params.id).lean();
  res.render("notes/edit", { noteEdit });
});

router.put("/note/edit/:id", async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, {
    title,
    description,
  }).lean();
  res.redirect("/note");
});

router.delete("/note/delete/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id).lean();
  res.redirect("/note");
});

module.exports = router;
