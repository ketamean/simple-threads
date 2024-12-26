const client = require("../config/database");

const Notification = {
  // get all noti
  getNotificationsByUserId: async (userId) => {
    const query = `
            SELECT * FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `;
    try {
      const res = await client.query(query, [userId]);
      return res.rows;
    } catch (err) {
      console.error("Error fetching notifications", err.stack);
      throw err;
    }
  },
  // add noti
  addNotification: async ({
    userId,
    imgInteractor,
    nameInteractor,
    link,
    describe,
    content,
    type,
    interactorId,
  }) => {
    const query = `
            INSERT INTO notifications (user_id, img_interactor, name_interactor, link, describe, content, type, interactor_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING *;
        `;
    const values = [
      userId,
      imgInteractor,
      nameInteractor,
      link,
      describe,
      content,
      type,
      interactorId,
    ];
    try {
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error adding notification", err.stack);
      throw err;
    }
  },

  // delete multiple notifications
  deleteMultipleNotifications: async (notificationIds) => {
    const query = `
                    DELETE FROM notifications WHERE id = ANY($1::int[])
                    RETURNING *;
            `;
    try {
      const res = await client.query(query, [notificationIds]);
      return res.rows;
    } catch (err) {
      console.error("Error deleting multiple notifications", err.stack);
      throw err;
    }
  },

  // update multiple notifications as read
  markMultipleAsRead: async (notificationIds) => {
    const query = `
            UPDATE notifications
            SET is_read = true
            WHERE id = ANY($1::int[])
            RETURNING *;
        `;
    try {
      const res = await client.query(query, [notificationIds]);
      return res.rows;
    } catch (err) {
      console.error("Error marking multiple notifications as read", err.stack);
      throw err;
    }
  },
};

module.exports = Notification;
