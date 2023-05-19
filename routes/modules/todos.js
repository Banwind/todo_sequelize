const express = require("express");
const router = express.Router();
const db = require("../../models");
const Todo = db.Todo

//進入新增紀錄的頁面
router.get("/new", (req, res) => {
  return res.render('new')
});

//新增一筆紀錄
router.post("/", (req, res) => {
  const name = req.body.name;
  const userId = req.user.id;

  return Todo.create({ name, UserId: userId, isDone : '0' })
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//瀏覽單筆todo的細節
router.get('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

//進入編輯todo的畫面
router.get('/:id/edit', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.log(error));
})

//更新一筆todo
router.put('/:id',(req, res) => {
  const userId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body

  Todo.findOne({ where: { id, userId }})
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

//刪除一筆資料
router.delete('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
})

module.exports = router;