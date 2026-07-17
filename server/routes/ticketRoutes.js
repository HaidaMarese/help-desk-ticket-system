const express = require("express");

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment,
  getTechnicians,
} = require("../controllers/ticketController");

const {
  protect,
  technicianOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/technicians", technicianOnly, getTechnicians);

router
  .route("/")
  .get(getTickets)
  .post(createTicket);

router
  .route("/:id")
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

router.post("/:id/comments", addComment);

module.exports = router;