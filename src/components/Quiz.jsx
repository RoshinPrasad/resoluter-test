import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(60); 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const storedQuestions = JSON.parse(localStorage.getItem("quizQuestions"));

        if (storedQuestions) {
          setQuestions(storedQuestions);
        } else {
          const response = await axios.get(
            "https://opentdb.com/api.php?amount=30&type=multiple"
          );
          const newQuestions = response.data.results;
          setQuestions(newQuestions);
          localStorage.setItem("quizQuestions", JSON.stringify(newQuestions));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval;
    if (currentQuestion < questions.length) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            handleAnswerSubmit();
            return 60;
          } else {
            return prevTimer - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval); 
  }, [currentQuestion, questions]);

  const handleAnswerSubmit = useCallback(() => {
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correct_answer;
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: currentQuestion, answer: selectedAnswer, correct: isCorrect },
    ]);
    setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    setSelectedAnswer(null);
    setTimer(60); 
  }, [questions, currentQuestion, selectedAnswer, timer]);
  

  const handleAnswerSelect = useCallback((answer) => {
    setSelectedAnswer(answer);
  }, []);

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    if (!question) {
      return <p>Loading...</p>;
    }

    return (
      <div className="my-8 mx-auto max-w-lg">
        <h3 className="text-xl font-bold mb-4 text-white uppercase">{question.question}</h3>
        <p className="text-xl text-red-300 my-2">Time remaining: {formatTime(timer)}</p>
        <ul>
          {question.incorrect_answers.map((answer) => (
            <li key={answer} className="mb-2 border rounded-lg p-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="answer"
                  value={answer}
                  checked={selectedAnswer === answer}
                  onChange={() => handleAnswerSelect(answer)}
                  className="form-radio h-5 w-5 text-green-600"
                />
                <span className="text-gray-100">{answer}</span>
              </label>
            </li>
          ))}
          <li className="mb-2 border rounded-lg p-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="answer"
                value={question.correct_answer}
                checked={selectedAnswer === question.correct_answer}
                onChange={() => handleAnswerSelect(question.correct_answer)}
                className="form-radio h-5 w-5 text-green-600"
              />
              <span className="text-gray-100">{question.correct_answer}</span>
            </label>
          </li>
        </ul>
        <button
          onClick={handleAnswerSubmit}
          className="bg-green-800 text-white py-2 px-4 mt-4 rounded-md hover:bg-green-600"
        >
          Submit Answer
        </button>
      </div>
    );
  };

  const renderResultsTable = () => {
    return (
      <div className="mx-auto max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed</h2>
        <p className="text-xl">Your Score: {score}</p>
        <table className="table-auto w-full text-center mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Question Number</th>
              <th className="border px-4 py-2">Correct Answer</th>
              <th className="border px-4 py-2">Correct</th>
            </tr>
          </thead>
          <tbody>
            {userAnswers.map(({ question, answer, correct }) => (
              <tr key={question}>
                <td className="border px-4 py-2 ">{question + 1}</td>
                <td className="border px-4 py-2">
                  {questions[question].correct_answer}
                </td>
                <td
                  className={`border px-4 py-2 ${
                    correct ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {correct ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col items-center justify-center ${currentQuestion < questions.length ? 'h-screen' : 'h-auto'} bg-gray-900`}>
      <div className="border p-10 rounded-xl bg-gray-950 mt-2 mb-2">
        <h1 className="text-5xl font-extrabold mb-4 flex justify-center items-center text-white">
          QUIZ
        </h1>
        {currentQuestion < questions.length
          ? renderQuestion()
          : renderResultsTable()}
      </div>
    </div>
  );
};

export default Quiz;
