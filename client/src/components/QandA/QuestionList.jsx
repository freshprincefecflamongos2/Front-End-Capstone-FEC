import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { config } from "../../../../env/config.js";
import QuestionForm from "./QuestionForm.jsx";
import Question from "./Question.jsx";
import SearchQandA from "./SearchQandA.jsx";
import questList from "./qAndA.js";
import { Button } from "../../styleComponents.jsx";
import { ClickTracker } from "../App.jsx";
import ClipLoader from "react-spinners/ClipLoader";

const QuestionList = ({ product }) => {
  const QA_BASE_URL = 'http://ec2-3-86-243-158.compute-1.amazonaws.com'


  // variables
  const { id } = product;

  // context
  const clickTracker = useContext(ClickTracker);

  // state
  const [qList, setQList] = useState([]);
  const [filtList, setFiltList] = useState([]);
  const [showQForm, setShowQForm] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [scrollAdd, setScrollAdd] = useState(false);
  const [searchSt, setSearchSt] = useState("");

  // on load
  useEffect(() => {
    axios
      .get(`${QA_BASE_URL}/qa/questions/${id}`)
      .then((response) => {
        response.data.results.sort(
          (a, b) => b.question_helpfulness - a.question_helpfulness
        );
        // tracker
        response.data.results.forEach((q) => {
          let exists = questList.find(
            (quest) => quest.question_id === q.question_id
          );
          if (!exists) {
            q.prodID = id;
            q.helpf_click = false;
            for (const id in q.answers) {
              q.answers[id].helpf_click = false;
              q.answers[id].reported = false;
            }
            questList.push(q);
          }
        });
        setQList(response.data.results.slice(0, 2));
        setFiltList(response.data.results.slice(0, 2));
        setSpinner(false);
        setScrollAdd(false);
      })
      .catch((err) => console.log(err));
  }, [product]);

  // methods
  let list = questList.filter((q) => q.prodID === id);
  list.sort((a, b) => b.question_helpfulness - a.question_helpfulness);

  const search = (event) => {
    setSearchSt(event.target.value);
    if (searchSt.length > 2) {
      let filtQ = list.filter((ques) => {
        let ans = ques.answers;
        for (let id in ans) {
          if (ans[id].body.toLowerCase().includes(searchSt.toLowerCase()))
            return true;
        }
        return ques.question_body
          .toLowerCase()
          .includes(searchSt.toLowerCase());
      });
      filtQ.sort((a, b) => b.question_helpfulness - a.question_helpfulness);
      setFiltList(filtQ);
    } else {
      setFiltList(qList);
    }
  };

  const expandQs = (event) => {
    let last = filtList.length;
    // setQList(list.slice(0, last + 2));
    // setFiltList(list.slice(0, last + 2));
    setQList(list.slice(0, last + 5));
    setFiltList(list.slice(0, last + 5));
    setScrollAdd(true);
    window.location.href = "#QA";
    history.pushState({}, "", window.location.origin);
  };

  const scroll = (e) => {
    let last = filtList.length;
    if (
      e.target.scrollTop + 1 >= e.target.scrollHeight - e.target.offsetHeight &&
      scrollAdd === true &&
      filtList.length < list.length &&
      searchSt.length < 3
    ) {
      setSpinner(true);
      setTimeout(() => {
        setSpinner(false);
        setQList(list.slice(0, last + 3));
        setFiltList(list.slice(0, last + 3));
      }, 1500);
    }
  };

  return (
    <div onClick={(e) => clickTracker(e, "Q&A")}>
      <h3 id="QA">{"QUESTIONS & ANSWERS"}</h3>
      <SearchQandA search={search} />
      <div className="qList" onScroll={scroll}>
        {filtList.map((question) => (
          <Question
            question={question}
            product={product}
            key={question.question_id}
          />
        ))}
      </div>
      {spinner ? (
        <SpinnerContainer>
          <ClipLoader color={"#dc143c"} loading={spinner} size={70} />
        </SpinnerContainer>
      ) : null}
      <div>
        {!scrollAdd ? (
          <Button onClick={expandQs} style={{ marginRight: "25px" }}>
            MORE ANSWERED QUESTIONS
          </Button>
        ) : null}
        <Button onClick={() => setShowQForm(!showQForm)}>
          ADD A QUESTION +
        </Button>
      </div>
      {showQForm ? (
        <QuestionForm product={product} setShowQForm={setShowQForm} />
      ) : null}
    </div>
  );
};

export default QuestionList;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`;
