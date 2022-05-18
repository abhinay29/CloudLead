import React, { useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

function CreateTemplateDnD() {
  let history = useHistory();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    type: "dnd",
    design: {}
  });
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      setFormData({ ...formData, content: html });
    });
  };

  const onLoad = () => {
    // editor instance is created
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  const onReady = () => {
    // editor is ready
    console.log("onReady");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      setFormData({ ...formData, design: design, content: html });
    });

    if (!formData.content) {
      return toast.error("Please fill all field, all are required");
    }

    try {
      let url = `${API_URL}/api/user/template/create`;
      let createTemplate = await fetch(url, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      let res = await createTemplate.json();
      if (res.status === "success") {
        toast.success(res.message);
        history.push("/templates");
      } else {
        toast.error("Something went wrong, please try again later.");
      }
    } catch (e) {
      toast.error("Something went wrong, please try again later.");
    }
  };

  const testEmail = async () => {
    setTestEmailLoading(true);
    await emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      setFormData({ ...formData, content: html });
    });

    setTimeout(() => {
      sendEmail();
    }, 1000);
  };

  const sendEmail = async () => {
    if (!formData.subject) {
      return toast.error("Subject is required.");
    }

    if (!formData.content) {
      return toast.error("Template content is required.");
    }

    try {
      let url = `${API_URL}/api/user/template/test-email`;
      let sendTestMail = await fetch(url, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        cache: "no-cache"
      });
      let res = await sendTestMail.json();
      if (res.status === "success") {
        toast.success(res.message);
      } else {
        toast.error(
          "Sorry cannot send email right now, please try again later"
        );
      }
    } catch (e) {
      toast.error("Something went wrong, please try again later.");
    }
    setTestEmailLoading(false);
  };

  return (
    <>
      <div className="fullHeightWithNavBar p-4">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="cardTitle mb-3 d-flex justify-content-between align-items-center">
                <h5>Create Template</h5>
                <div>
                  <Link to="/templates" className="btn btn-sm btn-primary me-2">
                    Templates
                  </Link>
                  <Link to="/sequences" className="btn btn-sm btn-primary">
                    Sequences
                  </Link>
                </div>
              </div>
              <div className="d-flex justify-content-end mb-3">
                {/* <Link
                to="/templates"
                className="btn btn-sm btn-outline-secondary py-0"
              >
                <i className="fas fa-chevron-left me-2"></i>Back to Template
              </Link> */}
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm py-0 me-2"
                  >
                    Save
                  </button>
                  <Link
                    to="/templates"
                    className="btn btn-danger btn-sm py-0 me-2"
                  >
                    Discard
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-success py-0"
                    onClick={testEmail}
                  >
                    {testEmailLoading && (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                      </>
                    )}
                    Send Test Email
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Template name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Template Subject
                </label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    aria-label="Template Subject"
                  />
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Mapwords
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{FIRSTNAME}}"
                          });
                        }}
                      >
                        First Name
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{LASTNAME}}"
                          });
                        }}
                      >
                        Last Name
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{COMPANYNAME}}"
                          });
                        }}
                      >
                        Company Name
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            subject: formData.subject + " {{TITLE}}"
                          });
                        }}
                      >
                        Title
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Template Content
                </label>
                <React.StrictMode>
                  <EmailEditor
                    ref={emailEditorRef}
                    onLoad={onLoad}
                    onReady={onReady}
                  />
                </React.StrictMode>
                {/* <EmailEditor
                  ref={emailEditorRef}
                  onLoad={onLoad}
                  onReady={onReady}
                /> */}
              </div>
              {/* <button onClick={exportHtml} className="btn btn-success me-2">
                Export HTML
              </button> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTemplateDnD;
