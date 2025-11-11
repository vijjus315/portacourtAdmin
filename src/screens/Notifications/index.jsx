import React from "react";
import { Icon } from "@iconify/react";
export default function Notifications() {
  return (
    <React.Fragment>
      <div className="box_Card">
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>New User Registration <span className="notifytime"><Icon icon="mdi:clock-outline"/>2 min ago</span></h2>
            <p>John Doe's payment of $850 for Sunset Villa booking failed during checkout scheduled for December 15th check-in with 5 nights stay and the reservation is now on hold pending payment resolution.</p>
          </div>
        </div>
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>Payment Failed <span className="notifytime"><Icon icon="mdi:clock-outline"/>15 min ago</span></h2>
            <p>John Doe's payment of $850 for Sunset Villa booking failed during checkout scheduled for December 15th check-in with 5 nights stay and the reservation is now on hold pending payment resolution.</p>
          </div>
        </div>
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>Property Awaiting Approval <span className="notifytime"><Icon icon="mdi:clock-outline"/>1 hour ago</span></h2>
            <p>Sarah Williams submitted Downtown Loft listing for approval located in Manhattan, NYC with 2 bedrooms, 1 bathroom priced at $180 per night with professional photos and complete documentation ready for your review.</p>
          </div>
        </div>
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>Booking Confirmed <span className="notifytime"><Icon icon="mdi:clock-outline"/>2 hours ago</span></h2>
            <p>Mike Chen booked Beach House property for 7 nights scheduled from December 15th to December 22nd with check-in at 3:00 PM for 4 guests with total payment of $1,890 including cleaning fees.</p>
          </div>
        </div>
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>New Review Received <span className="notifytime"><Icon icon="mdi:clock-outline"/>3 hours ago</span></h2>
            <p>Lisa Martinez left a 5-star review for Ocean View Apartment praising the stunning sunset views, immaculate cleanliness, and responsive host communication after her 3-night stay last weekend.</p>
          </div>
        </div>
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>Guest Complaint Filed <span className="notifytime"><Icon icon="mdi:clock-outline"/>4 hours ago</span></h2>
            <p>Tom Anderson reported excessive noise complaint for City Center Flat during his stay last night around 11:30 PM from neighboring unit affecting his sleep and requesting immediate resolution from property management.</p>
          </div>
        </div>
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>Scheduled Maintenance <span className="notifytime"><Icon icon="mdi:clock-outline"/>5 hours ago</span></h2>
            <p>Platform maintenance is scheduled for December 10th from 2:00 AM to 4:00 AM EST for database optimization and security updates with expected downtime of approximately 2 hours affecting all user access.</p>
          </div>
        </div>
        <div className="notification_Box">
          <span className="notificationIcon"><Icon icon="iconamoon:notification-fill"/></span>
          <div className="notificationcont">
            <h2>Payout Completed <span className="notifytime"><Icon icon="mdi:clock-outline"/>6 hours ago</span></h2>
            <p>David Lee received payout of $2,450 for Mountain Cabin earnings from November bookings after platform commission deduction of $350 transferred to his bank account ending in 4567.</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}