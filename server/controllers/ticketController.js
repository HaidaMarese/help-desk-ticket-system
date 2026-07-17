const Ticket = require("../models/Ticket");
const User = require("../models/User");

const canAccessTicket = (ticket, user) => {
  if (user.role === "technician") {
    return true;
  }

  return ticket.createdBy._id.toString() === user._id.toString();
};

const createTicket = async (request, response) => {
  try {
    const {
      title,
      description,
      category,
      priority,
    } = request.body;

    if (!title || !description) {
      return response.status(400).json({
        message: "Title and description are required",
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: request.user._id,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    return response.status(201).json(populatedTicket);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to create ticket",
      error: error.message,
    });
  }
};

const getTickets = async (request, response) => {
  try {
    const filter =
      request.user.role === "technician"
        ? {}
        : { createdBy: request.user._id };

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    return response.json(tickets);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to retrieve tickets",
      error: error.message,
    });
  }
};

const getTicketById = async (request, response) => {
  try {
    const ticket = await Ticket.findById(request.params.id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("comments.author", "name email role");

    if (!ticket) {
      return response.status(404).json({
        message: "Ticket not found",
      });
    }

    if (!canAccessTicket(ticket, request.user)) {
      return response.status(403).json({
        message: "You cannot view this ticket",
      });
    }

    return response.json(ticket);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to retrieve ticket",
      error: error.message,
    });
  }
};

const updateTicket = async (request, response) => {
  try {
    const ticket = await Ticket.findById(request.params.id);

    if (!ticket) {
      return response.status(404).json({
        message: "Ticket not found",
      });
    }

    const isOwner =
      ticket.createdBy.toString() === request.user._id.toString();

    if (request.user.role === "employee") {
      if (!isOwner) {
        return response.status(403).json({
          message: "You cannot update this ticket",
        });
      }

      if (ticket.status !== "Open") {
        return response.status(400).json({
          message: "Only open tickets can be edited",
        });
      }

      const allowedEmployeeFields = [
        "title",
        "description",
        "category",
        "priority",
      ];

      allowedEmployeeFields.forEach((field) => {
        if (request.body[field] !== undefined) {
          ticket[field] = request.body[field];
        }
      });
    } else {
      const allowedTechnicianFields = [
        "priority",
        "status",
        "assignedTo",
      ];

      allowedTechnicianFields.forEach((field) => {
        if (request.body[field] !== undefined) {
          ticket[field] = request.body[field] || null;
        }
      });
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("comments.author", "name email role");

    return response.json(updatedTicket);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to update ticket",
      error: error.message,
    });
  }
};

const deleteTicket = async (request, response) => {
  try {
    const ticket = await Ticket.findById(request.params.id);

    if (!ticket) {
      return response.status(404).json({
        message: "Ticket not found",
      });
    }

    const isOwner =
      ticket.createdBy.toString() === request.user._id.toString();

    if (request.user.role !== "technician" && !isOwner) {
      return response.status(403).json({
        message: "You cannot delete this ticket",
      });
    }

    if (
      request.user.role === "employee" &&
      ticket.status !== "Open"
    ) {
      return response.status(400).json({
        message: "Only open tickets can be deleted",
      });
    }

    await ticket.deleteOne();

    return response.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Unable to delete ticket",
      error: error.message,
    });
  }
};

const addComment = async (request, response) => {
  try {
    const { message } = request.body;

    if (!message || !message.trim()) {
      return response.status(400).json({
        message: "Comment message is required",
      });
    }

    const ticket = await Ticket.findById(request.params.id)
      .populate("createdBy", "name email role");

    if (!ticket) {
      return response.status(404).json({
        message: "Ticket not found",
      });
    }

    if (!canAccessTicket(ticket, request.user)) {
      return response.status(403).json({
        message: "You cannot comment on this ticket",
      });
    }

    ticket.comments.push({
      message: message.trim(),
      author: request.user._id,
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("comments.author", "name email role");

    return response.status(201).json(updatedTicket);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to add comment",
      error: error.message,
    });
  }
};

const getTechnicians = async (request, response) => {
  try {
    const technicians = await User.find({
      role: "technician",
    }).select("name email role");

    return response.json(technicians);
  } catch (error) {
    return response.status(500).json({
      message: "Unable to retrieve technicians",
      error: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addComment,
  getTechnicians,
};