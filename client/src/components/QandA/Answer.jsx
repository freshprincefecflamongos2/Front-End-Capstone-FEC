import React, { useState } from "react";
import axios from "axios";
import { config } from "../../../../env/config.js";
import { parseISO } from "date-fns";
import questList from "./qAndA.js";
import {
  ModalClose,
  ModalImg,
  Modal,
  ModalOverlay,
} from "../../styleComponents.jsx";

const Answer = ({ answer, question_id }) => {
  const QA_BASE_URL = 'http://ec2-3-86-243-158.compute-1.amazonaws.com';

  const { answerer_name, body, date, helpfulness, id, photos } = answer;

  // variables
  const ques = questList.find((q) => q.question_id === question_id);
  const answ = ques.answers[id];
  const hrDt = parseISO(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // state
  const [a_helpf, setHelpfulness] = useState(helpfulness);
  const [modal, setModal] = useState(false);
  const [reportSt, setReportSt] = useState(answ.reported);

  // methods
  const incHelp = () => {
    if (!answ.helpf_click) {
      axios
        .put(`${QA_BASE_URL}/qa/answers/${id}/helpful`, {})
        .then(() => {
          answ.helpf_click = true;
          answ.helpfulness += 1;
          setHelpfulness(a_helpf + 1);
        })
        .catch((err) => console.log(err));
    }
  };

  const imgZoom = (event) => {
    setModal(event.target.src);
  };

  const reportAns = () => {
    axios
      .put(`${QA_BASE_URL}/qa/answers/${id}/report`, {})
      .then(() => {
        answ.reported = true;
        setReportSt(answ.reported);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="qAndAAns">
      {modal ? (
        <ModalOverlay>
          <Modal>
            <ModalImg src={modal} />
            <ModalClose onClick={imgZoom}>X</ModalClose>
          </Modal>
        </ModalOverlay>
      ) : null}
      <div>{body}</div>
      { photos && (
        <div>
          {photos.map((photo, i) => (
            <img
              src={photo}
              onError={(e) => {
                e.target.src =
                  "https://www.cnet.com/a/img/resize/905e1d3662ccaaf4763408156c833b91a47dfd07/2020/08/31/9562c49a-8f37-434d-8070-2751fb03d683/will-smith-fresh-prince-bel-air.jpg?auto=webp&fit=crop&height=900&width=1200";
                e.target.onError = null;
              }}
              key={id + i}
              onClick={imgZoom}
              className="ansPhotos"
            />
          ))}
        </div>
      ) }
      <small>
        {"by "}
        {answerer_name === "Seller" ? <b>{answerer_name}</b> : answerer_name}
        {", " + hrDt + " | Helpful? "}
        {answ.helpf_click ? (
          " Yes "
        ) : (
          <u className="clickable" onClick={incHelp}>
            Yes
          </u>
        )}
        {" (" + a_helpf + ") | "}
        {reportSt ? (
          " Reported "
        ) : (
          <u className="clickable" onClick={reportAns}>
            Report
          </u>
        )}
      </small>
    </div>
  );
};

export default Answer;
