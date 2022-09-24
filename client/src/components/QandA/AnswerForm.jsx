import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { config } from "../../../../env/config.js";
import questList from "./qAndA.js";
import Upload from "../Ratings_Reviews/Reviews/Modal/Upload.jsx";
import {
  Modal,
  ModalClose,
  InputButton,
  ModalOverlay,
  ModalForm,
} from "../../styleComponents.jsx";

const AnswerForm = ({ question, product, setShowAForm, setAnsState }) => {
  const QA_BASE_URL = 'http://ec2-3-86-243-158.compute-1.amazonaws.com';

  // variable
  const { question_id, question_body } = question;

  // state
  const [emailWarn, setEmailWarn] = useState(false);
  const [photos, setPhotos] = useState([]);

  // methods
  const postAnswer = (event) => {
    event.preventDefault();
    const emailValid = /\S+@\S+\.\S+/.test(event.target.elements.email.value);
    setEmailWarn(!emailValid);
    if (emailValid) {
      const data = {
        body: event.target.elements.answer.value,
        name: event.target.elements.nickname.value,
        email: event.target.elements.email.value,
        photos: photos.slice(0, 5),
      };
      axios
        .post(`${QA_BASE_URL}/qa/questions/${question_id}/answers`, data)
        .then(() =>
          axios.get(`${QA_BASE_URL}/qa/questions/${question_id}/answers`)
        )
        .then((res) => {
          const ques = questList.find((q) => q.question_id === question_id);
          for (const ans of res.data.results) {
            if (!(ans.answer_id.toString() in ques.answers)) {
              ans.id = ans.answer_id;
              ans.helpf_click = false;
              delete ans.answer_id;
              ques.answers[ans.id] = ans;
            }
          }
          setAnsState(ques.answers);
          setShowAForm(false);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <ModalOverlay>
      <Modal>
        <ModalForm onSubmit={postAnswer}>
          <QFHeader>Submit your Answer</QFHeader>
          <small>
            {product.name}: {question_body}
          </small>
          <br />
          <label>Your Answer*</label>
          <br />
          <textarea
            style={{ width: "90%" }}
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
            placeholder="Example: jack543!"
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
            required
          />
          <br />
          <small>For authentication reasons, you will not be emailed</small>
          <br />
          <label>Upload Photos: </label>
          <Upload upload={setPhotos} />
          <br />
          <InputButton type="submit" value="Submit Answer" />
        </ModalForm>
        <ModalClose onClick={() => setShowAForm(false)}>X</ModalClose>
      </Modal>
    </ModalOverlay>
  );
};

export default AnswerForm;

const QFHeader = styled.h3`
  margin-top: 0px;
  margin-bottom: 0px;
`;

const QFInput = styled.input`
  width: 90%;
`;

const EmailWarn = styled.small`
  color: red;
`;
