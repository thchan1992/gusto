import { Quiz } from "@/lib/types/Quiz";
import React, { useEffect, useState } from "react";

interface ShowQuizProps {
  id: string;
}
const ShowQuiz: React.FC<ShowQuizProps> = ({ id }) => {
  const [quizList, setQuizList] = useState<Quiz[] | []>([]);
  const [troubleShoot, setTroubleShoot] = useState([]);
  const [index, setIndex] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const fetchTroubleShoots = async () => {
      try {
        const response = await fetch("/api/troubleshoot/get/" + id);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setTroubleShoot(data.data.troubleshoot);
        setQuizList(data.data.questions);
      } catch (error) {
        console.log(error);
        // setError(error.message);
      } finally {
        // setLoading(false);
      }
    };
    fetchTroubleShoots();

    let initialIndex: string = "";
    let quiz: Quiz | null = null;
    setIndex(initialIndex);
    setIsLoading(false);
  }, []);

  return <div>{id}</div>;
};

export default ShowQuiz;
