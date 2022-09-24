import React, { useState, useEffect } from "react";
import axios from "axios";
import AnswerList from "./AnswerList.jsx";
import AnswerForm from "./AnswerForm.jsx";
import { config } from "../../../../env/config.js";
import styled from "styled-components";
import questList from "./qAndA.js";

const Question = ({ question, product }) => {

  const QA_BASE_URL = 'http://ec2-3-86-243-158.compute-1.amazonaws.com'


  const {
    answers,
    asker_name,
    question_body,
    question_date,
    question_helpfulness,
    question_id,
    reported,
  } = question;

  // variable
  const ques = questList.find((q) => q.question_id === question_id);

  // state
  const [helpfulness, setHelpfulness] = useState(question_helpfulness);
  const [showAForm, setShowAForm] = useState(false);
  const [ansState, setAnsState] = useState(answers);

  // methods
  const incHelp = () => {
    if (!ques.helpf_click) {
      axios
        .put(`${QA_BASE_URL}/qa/questions/${question_id}/helpful`, {})
        .then(() => {
          ques.helpf_click = true;
          ques.question_helpfulness += 1;
          setHelpfulness(helpfulness + 1);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <div className="question">
        <div className="qAndA">
          <b>Q:</b>
          <Qbody>{question_body}</Qbody>
        </div>
        <small style={{ marginRight: "10px" }}>
          {" Helpful? "}
          {ques.helpf_click ? (
            " Yes "
          ) : (
            <u className="clickable" onClick={incHelp}>
              Yes
            </u>
          )}
          {" (" + helpfulness + ") "} |{" "}
          <u className="clickable" onClick={() => setShowAForm(!showAForm)}>
            Add Answer
          </u>
        </small>
      </div>
      <div className="qAndA">
        <div>
          <b>A:</b>
        </div>
        <AnswerList answers={ansState} question_id={question_id} />
      </div>
      {showAForm ? (
        <AnswerForm
          question={question}
          product={product}
          setShowAForm={setShowAForm}
          setAnsState={setAnsState}
        />
      ) : null}
    </div>
  );
};

export default Question;

const Qbody = styled.b`
  max-width: 550px;
`;
