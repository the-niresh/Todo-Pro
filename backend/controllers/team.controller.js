import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createNewTeam = async (req, res) => {
  const { teamName, teamMembers } = req.body;
  let { teamImg } = req.body;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!teamName) {
      return res.status(400).json({ error: "Please provide a Team name" });
    }

    if (teamImg) {
      const uploadedResponse = await cloudinary.uploader.upload(teamImg);
      teamImg = uploadedResponse.secure_url;
    }

    let userDocs = [];
    if (teamMembers && teamMembers.length > 0) {
      userDocs = await User.find({ username: { $in: teamMembers } });

      if (userDocs.length !== teamMembers.length) {
        return res
          .status(404)
          .json({ message: "One or more team members not found" });
      }
    }

    const newTeam = new Team({
      teamName,
      teamImg,
      createdBy: user._id,
      admins: user._id,
      teamMembers: userDocs.map((user) => user._id),
    });

    await newTeam.save();

    // adding teamIDs to each teamMember's teams[]
    const userIdsToUpdate = [user._id, ...userDocs.map((user) => user._id)];
    await User.updateMany( { _id: { $in: userIdsToUpdate } },  { $addToSet: { teams: newTeam._id }});

    const populatedTeam = await Team.findById(newTeam._id)
      .select("-_id")
      .populate({ path: "admins", select: "-_id fullName" })
      .populate({ path: "createdBy", select: "-_id fullName" })
      .populate({ path: "teamMembers", select: "-_id email username fullName"
      });

    res.status(201).json({ success: true, team: populatedTeam });
  } catch (error) {
    console.error("Error in createNewTeam:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const addTeamMember = async (req, res) => {
  const { teamMembers } = req.body;
  const { teamId } = req.params;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isAdmin = await Team.findOne({ _id: teamId, admins: userId });
    if (!isAdmin) {
      return res.status(404).json({ message: "Not an Admin" });
    }

    let userDocs = [];
    if (teamMembers && teamMembers.length > 0) {
      userDocs = await User.find({ username: { $in: teamMembers } });

      if (userDocs.length !== teamMembers.length) {
        return res
          .status(404)
          .json({ message: "One or more team members not found" });
      }
    }

    const team = await Team.findById(teamId);
    const existingMembers = team.teamMembers.map((member) => member.toString());
    const newMembers = userDocs.map((user) => user._id.toString());
    const membersToAdd = newMembers.filter(
      (id) => !existingMembers.includes(id)
    );
    if (membersToAdd.length === 0) {
      return res
        .status(400)
        .json({ message: "All users are already part of the team." });
    }

    await User.updateMany(
      { _id: { $in: membersToAdd } },
      { $addToSet: { teams: teamId } }
    );

    // Add users to the team's teamMembers array
    team.teamMembers.push(...membersToAdd);
    await team.save();

    const populatedTeam = await Team.findById(teamId)
      .select("-_id")
      .populate({ path: "admins", select: "-_id fullName" })
      .populate({ path: "createdBy", select: "-_id fullName" })
      .populate({
        path: "teamMembers",
        select: "-_id email username fullName",
      });

    res.status(201).json({ success: true, team: populatedTeam });
  } catch (error) {
    console.error("Error in createNewTeam:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const makeThemAdmin = async (req, res) => {};
export const makeThemUser = async (req, res) => {};
export const removeTeamMember = async (req, res) => {};
export const deleteExistingTeam = async (req, res) => {};
