"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../Button";
import { Quiz } from "@/lib/types/Quiz";
const SharedTroubleshoot = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Quiz | null>(null);
  const [history, setHistory] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [questionList, setQuestionList] = useState<Quiz[]>([]);
  const [troubleshootTitle, setTroubleShootTitle] = useState<string>("");
  const router = useRouter();

  useEffect(() => {}, []);
  return <div>{token}</div>;
};

export default SharedTroubleshoot;
