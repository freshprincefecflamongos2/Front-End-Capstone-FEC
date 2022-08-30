import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import config from "../../../../env/config.js";

const AnswerForm = ({ question, product, setShowAForm }) => {
  // variable
  const { question_id, question_body } = question;
  let emailValid = false;

  // state
  const [emailWarn, setEmailWarn] = useState(false);

  // methods
  const chkEmailFormat = (event) => {
    emailValid = /\S+@\S+\.\S+/.test(event.target.value);
    console.log(emailValid);
  };

  const postAnswer = (event) => {
    event.preventDefault();
    setEmailWarn(!emailValid);
    if (emailValid) {
      const data = {
        body: event.target.elements.answer.value,
        name: event.target.elements.nickname.value,
        email: event.target.elements.email.value,
        photos: [],
      };
      console.log(data);
      axios
        .post(`/qa/questions/${question_id}/answers`, data, config)
        .then((response) => {
          console.log(response);
          // should render new answers here: set state
          setShowAForm(false);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal">
        <form className="modalForm" onSubmit={postAnswer}>
          <QFHeader>Submit your Answer</QFHeader>
          <small>
            {product.name}: {question_body}
          </small>
          <br />
          <label>Your Answer*</label>
          <br />
          <textarea
            name="answer"
            maxLength="1000"
            rows="4"
            cols="50"
            required
          />
          <br />
          <label>What is your nickname*</label>
          <br />
          <QFInput
            type="text"
            name="nickname"
            placeholder="Example: jackson543!"
            maxLength="60"
            required
          />
          <br />
          <small>
            For privacy reasons, do not use your full name or email address
          </small>
          <br />
          <label>Your email* </label>
          {emailWarn ? <EmailWarn>{" email address invalid"}</EmailWarn> : null}
          <br />
          <QFInput
            type="email"
            name="email"
            placeholder="Example: jack@email.com"
            maxLength="60"
            onChange={chkEmailFormat}
            required
          />
          <br />
          <small>For authentication reasons, you will not be emailed</small>
          <br />
          <button>Upload your photos</button>
          <br />
          <input type="submit" value="Submit Answer" />
        </form>
        <div className="modalFormClose" onClick={() => setShowAForm(false)}>
          X
        </div>
      </div>
    </div>
  );
};

export default AnswerForm;

const QFHeader = styled.h3`
  margin-top: 0px;
  margin-bottom: 0px;
`;

const QFInput = styled.input`
  width: 400px;
`;

const EmailWarn = styled.small`
  color: red;
`;