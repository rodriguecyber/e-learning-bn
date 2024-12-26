import { Response } from 'express';
import UserNotification from '../../models/UserNotification';
import { AuthRequest } from '../../middleware/auth.middleware';

export class NotificationController {
  static async createNotification(req: AuthRequest, res: Response) {
    try {
      const notification = new UserNotification({
        ...req.body,
        user_id: req.user?._id
      });

      await notification.save();
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create notification', error });
    }
  }

  static async getUserNotifications(req: AuthRequest, res: Response) {
    try {
      const { type, read } = req.query;
      let query: any = { user_id: req.user?._id };

      if (type) query.notification_type = type;
      if (read !== undefined) query.is_read = read === 'true';

      const notifications = await UserNotification.find(query)
        .sort({ created_at: -1 })
        .limit(50);

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notifications', error });
    }
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { notification_ids } = req.body;
      await UserNotification.updateMany(
        {
          _id: { $in: notification_ids },
          user_id: req.user?._id
        },
        { is_read: true }
      );

      res.json({ message: 'Notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update notifications', error });
    }
  }

  static async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const notification = await UserNotification.findOneAndDelete({
        _id: req.params.id,
        user_id: req.user?._id
      });

      if (!notification) {
         res.status(404).json({ message: 'Notification not found' });
         return
      }

      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete notification', error });
    }
  }
}