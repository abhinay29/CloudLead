import React from 'react'

function SettingsNotifications() {
  return (
    <div className="mt-3">
      <h5>Notification Settings</h5>
      <form action="">
        <div className="mb-3">
          <lable className="form-label" htmlFor="notifyEmails">Email addresses</lable>
          <textarea name="notifyEmails" id="notifyEmails" cols="30" rows="2" className="form-control" placeholder="Enter email addresses seperated by comma"></textarea>
          <p style={{ "fontSize": ".75rem" }}>Notifications will be sent to these email addresses.</p>
        </div>
        <div className="mb-3">
          <lable className="form-label" htmlFor="notifyEmails">Administrator Email addresses</lable>
          <textarea name="notifyEmails" id="notifyEmails" cols="30" rows="2" className="form-control" placeholder="Enter email addresses seperated by comma"></textarea>
          <p style={{ "fontSize": ".75rem" }}>Weekly Statistic of your account will be sent to these email addresses.</p>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  )
}

export default SettingsNotifications
