import { RequestHandler } from "express";
import db from "../dbConnection/db";
import { ResultSetHeader } from "mysql2";

const makeGroup: RequestHandler = async (req, res) => {
  try {
    const { groupName, membersId } = req.body;
    const userId = (req as any).userId;

    const AdminIdWithMembers = [userId, ...membersId];

    if (!groupName) {
      res
        .status(400)
        .json({ success: false, message: "Please provide group name" });
      return;
    }

    if (AdminIdWithMembers.length < 2) {
      res
        .status(400)
        .json({
          success: false,
          message: "Please provide at least two member",
        });
      return;
    }

    const [groupCreated] = await db.query(
      "INSERT INTO `groups` (group_name, created_by) VALUES(?,?)",
      [groupName, userId]
    );
    //get groupID
    const groupId = (groupCreated as ResultSetHeader)?.insertId;

    //get valid users only
    const [validMembers] = (await db.query(
      `SELECT id FROM users WHERE id IN (?)`,
      [AdminIdWithMembers]
    )) as any[];
    const validMembersId = validMembers.map(
      (member: { id: number }) => member.id
    );
    if (validMembersId.length < 2) {
      res
        .status(400)
        .json({ success: false, message: "Please provide valid members" });
      return;
    }

    //insert members into group_members table
    const members: [number, number][] = AdminIdWithMembers.map((id) => [
      groupId,
      id,
    ]);
    await db.query(`INSERT INTO group_members (group_id, user_id) VALUES ?`, [
      members,
    ]);

    res
      .status(201)
      .json({ success: true, message: "Group created successfully", groupId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Failure" });
    return;
  }
};

export { makeGroup };
