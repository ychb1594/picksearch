import React, { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, X, Target, TrendingUp, Users, Sparkles, ArrowRight, Zap, Shield, Award } from "lucide-react";

// 카카오톡 로그인 함수
const handleKakaoLogin = () => {
  // 환경 변수에서 카카오 키 가져오기 (없으면 기본값 사용)
  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY || 'YOUR_KAKAO_JAVASCRIPT_KEY';
  
  // 카카오톡 로그인 SDK 초기화 및 로그인 처리
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoKey);
  }
  
  if (window.Kakao && window.Kakao.Auth) {
    window.Kakao.Auth.login({
      success: function(authObj) {
        console.log('카카오 로그인 성공', authObj);
        
        // 사용자 정보 가져오기
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function(response) {
            console.log('사용자 정보:', response);
            // 로그인 성공 후 처리 로직
            // 예: 로컬 스토리지에 저장
            localStorage.setItem('kakao_user', JSON.stringify(response));
            // 예: 다른 페이지로 리다이렉트
            // window.location.href = '/dashboard';
          },
          fail: function(error) {
            console.error('사용자 정보 가져오기 실패:', error);
          }
        });
      },
      fail: function(err) {
        console.error('카카오 로그인 실패', err);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    });
  } else {
    alert('카카오톡 SDK가 로드되지 않았습니다.');
  }
};

export default function LandingPage() {
  const [typedText, setTypedText] = useState("");
  const [showTargetOptions, setShowTargetOptions] = useState(false);
  const [showAISearching, setShowAISearching] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

  const surveyExamples = [
    {
      input: "20대 여성 립스틱 선호도 조사해줘",
      title: "20대 여성 립스틱 선호도 조사",
      questions: "5개 질문 • 예상 소요시간 3분",
      badges: [
        { text: "객관식 3개", color: "blue" },
        { text: "이미지 2개", color: "purple" }
      ]
    },
    {
      input: "30대 남성 자동차 구매 의향 분석",
      title: "30대 남성 자동차 구매 의향 분석",
      questions: "7개 질문 • 예상 소요시간 5분",
      badges: [
        { text: "객관식 4개", color: "blue" },
        { text: "순위형 2개", color: "amber" },
        { text: "주관식 1개", color: "gray" }
      ]
    },
    {
      input: "40대 부모 교육 서비스 니즈 파악",
      title: "40대 부모 교육 서비스 니즈 파악",
      questions: "6개 질문 • 예상 소요시간 4분",
      badges: [
        { text: "객관식 3개", color: "blue" },
        { text: "다중선택 2개", color: "violet" },
        { text: "리커트 1개", color: "indigo" }
      ]
    },
    {
      input: "Z세대 패션 트렌드 조사하기",
      title: "Z세대 패션 트렌드 조사",
      questions: "8개 질문 • 예상 소요시간 5분",
      badges: [
        { text: "이미지선택 3개", color: "purple" },
        { text: "객관식 4개", color: "blue" },
        { text: "수치평정 1개", color: "teal" }
      ]
    },
    {
      input: "50대 건강식품 구매 패턴 분석해줘",
      title: "50대 건강식품 구매 패턴 분석",
      questions: "6개 질문 • 예상 소요시간 4분",
      badges: [
        { text: "객관식 4개", color: "blue" },
        { text: "순위형 1개", color: "amber" },
        { text: "주관식 1개", color: "gray" }
      ]
    }
  ];

  const targetExamples = [
    { keyword: "최근 30일 PS5 검색", count: 38492, message: "최근 PS5 게임 검색했어요" },
    { keyword: "어제 스킨케어 구매", count: 24891, message: "어제 스킨케어 구매했어요" },
    { keyword: "이번 주 자동차 관심", count: 15672, message: "이번주 자동차 앱 봤어요" },
    { keyword: "최근 부동산 앱 실행", count: 42183, message: "최근 부동산 앱 켰어요" },
    { keyword: "지난달 육아용품 검색", count: 31204, message: "지난달 육아용품 샀어요" }
  ];

  const currentExample = surveyExamples[currentExampleIndex];
  const currentTarget = targetExamples[currentTargetIndex];

  const [selectedTargetIndices, setSelectedTargetIndices] = useState([]);
  const [showCursor, setShowCursor] = useState(false);

  const getTargetOptionsForExample = (index) => {
    const options = [
      // 0. 20대 여성 립스틱
      [
        { label: "20대 여성", icon: "👩", correct: true },
        { label: "뷰티 관심", icon: "💄", correct: true },
        { label: "쇼핑앱 이용", icon: "🛍️", correct: false },
        { label: "고소비층", icon: "💳", correct: false },
        { label: "명품 선호", icon: "💎", correct: false },
        { label: "강남권", icon: "📍", correct: false }
      ],
      // 1. 30대 남성 자동차
      [
        { label: "30대 남성", icon: "👨", correct: true },
        { label: "자동차 관심", icon: "🚗", correct: true },
        { label: "금융앱 이용", icon: "💰", correct: false },
        { label: "골프", icon: "⛳", correct: false },
        { label: "고소비층", icon: "💳", correct: false },
        { label: "서울/경기", icon: "📍", correct: false }
      ],
      // 2. 40대 부모 교육
      [
        { label: "40대 부모", icon: "👨‍👩‍👦", correct: true },
        { label: "교육 관심", icon: "📚", correct: true },
        { label: "육아앱 이용", icon: "👶", correct: false },
        { label: "학원 탐색", icon: "🎓", correct: false },
        { label: "중산층", icon: "💳", correct: false },
        { label: "전국", icon: "🗺️", correct: false }
      ],
      // 3. Z세대 패션
      [
        { label: "Z세대", icon: "🎮", correct: true },
        { label: "패션 관심", icon: "👗", correct: true },
        { label: "SNS 활동", icon: "📱", correct: false },
        { label: "온라인쇼핑", icon: "🛍️", correct: false },
        { label: "20대", icon: "👥", correct: false },
        { label: "학생", icon: "🎓", correct: false }
      ],
      // 4. 50대 건강식품
      [
        { label: "50대", icon: "👴", correct: true },
        { label: "건강 관심", icon: "💪", correct: true },
        { label: "운동 관심", icon: "🏃", correct: false },
        { label: "배달앱 이용", icon: "🍔", correct: false },
        { label: "골프", icon: "⛳", correct: false },
        { label: "고소비층", icon: "💳", correct: false }
      ]
    ];
    return options[index % options.length];
  };

  const targetOptions = getTargetOptionsForExample(currentExampleIndex);

  // Survey typing animation with cycling through steps
  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeoutIds = [];
    
    const timer = setInterval(() => {
      if (!isDeleting && index <= currentExample.input.length) {
        setTypedText(currentExample.input.slice(0, index));
        index++;
        if (index === currentExample.input.length + 1) {
          // Step 1: Show target options
          const t1 = setTimeout(() => {
            setShowTargetOptions(true);
            setSelectedTargetIndices([]);
          }, 500);
          timeoutIds.push(t1);
          
          // Step 2: Show cursor and select first target
          const t2 = setTimeout(() => {
            setShowCursor(true);
          }, 1200);
          timeoutIds.push(t2);
          
          const t3 = setTimeout(() => {
            const opts = getTargetOptionsForExample(currentExampleIndex);
            const correctIndices = opts.map((opt, idx) => opt.correct ? idx : -1).filter(idx => idx !== -1);
            if (correctIndices[0] !== undefined) {
              setSelectedTargetIndices([correctIndices[0]]);
            }
          }, 2300);
          timeoutIds.push(t3);
          
          // Step 2.5: Select second target
          const t3_5 = setTimeout(() => {
            const opts = getTargetOptionsForExample(currentExampleIndex);
            const correctIndices = opts.map((opt, idx) => opt.correct ? idx : -1).filter(idx => idx !== -1);
            setSelectedTargetIndices(correctIndices);
          }, 3200);
          timeoutIds.push(t3_5);
          
          // Step 3: Hide cursor and show AI searching
          const t4 = setTimeout(() => {
            setShowCursor(false);
            setShowAISearching(true);
          }, 3700);
          timeoutIds.push(t4);
          
          // Step 4: Show survey
          const t5 = setTimeout(() => {
            setShowAISearching(false);
            setShowSurvey(true);
          }, 5200);
          timeoutIds.push(t5);
          
          // Step 5: Cycle to next example
          const t6 = setTimeout(() => {
            setShowSurvey(false);
            setShowTargetOptions(false);
            setSelectedTargetIndices([]);
            isDeleting = true;
            setCurrentExampleIndex((prev) => (prev + 1) % surveyExamples.length);
          }, 7700);
          timeoutIds.push(t6);
        }
      } else if (isDeleting && index > 0) {
        setTypedText(currentExample.input.slice(0, index));
        index--;
      } else if (isDeleting && index === 0) {
        isDeleting = false;
        index = 0;
      }
    }, isDeleting ? 15 : 50);

    return () => {
      clearInterval(timer);
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [currentExample, currentExampleIndex]);

  // Target ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTargetIndex((prev) => (prev + 1) % targetExamples.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getBadgeColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      violet: 'bg-violet-100 text-violet-800 border-violet-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="max-w-[440px] mx-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-gray-200/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#3182F6] to-[#4294FF] rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-[#191F28] text-lg">픽서치</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button 
                onClick={handleKakaoLogin}
                variant="ghost" 
                size="sm" 
                className="text-[#191F28] hover:bg-[#3182F6]/10 hover:text-[#3182F6] font-medium"
              >
                로그인
              </Button>
            </motion.div>
          </div>
        </header>

        {/* 1. Hero Section with Animation */}
        <section className="px-6 pt-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6 border border-blue-100"
            >
              <Sparkles className="w-4 h-4 text-[#3182F6]" />
              <span className="text-sm font-medium text-[#3182F6]">AI 설문조사 플랫폼</span>
            </motion.div>

            <h1 className="text-4xl font-bold text-[#191F28] mb-4 leading-tight">
              한 문장으로<br />
              <span className="bg-gradient-to-r from-[#3182F6] to-[#4294FF] bg-clip-text text-transparent">
                정밀한 설문조사
              </span>
            </h1>
            <p className="text-[#8B95A1] text-base mb-8 leading-relaxed">
              AI가 질문을 만들고, 타겟을 찾아<br />
              원하는 응답을 모아드립니다
            </p>

            {/* Interactive Demo */}
            <motion.div 
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Input Area */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3182F6] to-[#4294FF] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#191F28] flex items-center gap-2">
                      <span>{typedText}</span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-[#3182F6]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Options */}
              {showTargetOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-b border-gray-100 bg-gray-50/50 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-[#3182F6]" />
                      <span className="text-xs font-medium text-[#8B95A1]">타겟 선택</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {targetOptions.map((option, idx) => {
                        const isSelected = selectedTargetIndices.includes(idx);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#3182F6] text-white shadow-md scale-105'
                                : 'bg-white text-[#191F28] border border-gray-200'
                            }`}
                          >
                            <span className="mr-1.5">{option.icon}</span>
                            {option.label}
                            {showCursor && idx === selectedTargetIndices[selectedTargetIndices.length - 1] && (
                              <motion.div
                                className="absolute -right-1 -top-1 w-5 h-5"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2 2L18 10L8 12L2 18L2 2Z" fill="#3182F6" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Searching */}
              {showAISearching && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/30"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5"
                      >
                        <Sparkles className="w-5 h-5 text-[#3182F6]" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-[#191F28]">AI가 설문을 생성하고 있습니다</p>
                        <div className="flex gap-1 mt-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 bg-[#3182F6] rounded-full"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Generated Survey */}
              {showSurvey && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="p-5"
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-green-600">설문 생성 완료</span>
                      </div>
                      <h3 className="font-bold text-[#191F28] text-base mb-2">
                        {currentExample.title}
                      </h3>
                      <p className="text-sm text-[#8B95A1] mb-3">{currentExample.questions}</p>
                      <div className="flex flex-wrap gap-2">
                        {currentExample.badges.map((badge, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getBadgeColorClass(badge.color)}`}
                          >
                            {badge.text}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </section>

        {/* 2. Feature Cards */}
        <section className="px-6 py-12 bg-gradient-to-b from-white to-gray-50">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[#191F28] mb-3 text-center">
              3분이면 충분합니다
            </h3>
            <p className="text-[#8B95A1] text-center mb-8">
              복잡한 과정 없이 빠르게
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Sparkles,
                  title: "AI가 질문 작성",
                  desc: "목적만 말하면 AI가 적합한 질문 구성",
                  color: "from-blue-500 to-blue-600",
                  delay: 0
                },
                {
                  icon: Target,
                  title: "원하는 타겟 발견",
                  desc: "1.3억 데이터에서 정확한 타겟 매칭",
                  color: "from-purple-500 to-purple-600",
                  delay: 0.1
                },
                {
                  icon: TrendingUp,
                  title: "즉시 데이터 분석",
                  desc: "실시간 응답 수집과 인사이트 제공",
                  color: "from-orange-500 to-orange-600",
                  delay: 0.2
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(49, 130, 246, 0.15)",
                  }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#191F28] mb-1">{feature.title}</h4>
                      <p className="text-sm text-[#8B95A1] leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 3. Social Proof */}
        <section className="px-6 py-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100 shadow-sm">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Award className="w-12 h-12 text-[#3182F6] mb-3 mx-auto" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#191F28] mb-2">
                  이미 많은 기업이 선택했습니다
                </h3>
                <p className="text-[#8B95A1] text-sm">
                  신뢰할 수 있는 데이터와 빠른 인사이트
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "누적 설문", value: "2,400+", icon: "📊" },
                  { label: "누적 응답", value: "150만+", icon: "✅" },
                  { label: "데이터 포인트", value: "1.3억", icon: "🎯" },
                  { label: "평균 완료시간", value: "3분", icon: "⚡" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100"
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-[#3182F6] mb-1">{stat.value}</div>
                    <div className="text-xs text-[#8B95A1] font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. Real-time Ticker */}
        <section className="px-6 py-12 bg-gradient-to-b from-white to-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[#191F28] mb-3 text-center">
              지금 이 순간에도
            </h3>
            <p className="text-[#8B95A1] text-center mb-8">
              실시간으로 응답이 수집되고 있습니다
            </p>

            <motion.div
              key={currentTarget.keyword}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-[#3182F6]" />
                    <span className="text-xs font-medium text-[#8B95A1]">타겟 매칭</span>
                  </div>
                  <p className="text-sm font-medium text-[#191F28] mb-1">{currentTarget.message}</p>
                  <p className="text-xs text-[#8B95A1]">{currentTarget.keyword}</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-bold text-[#3182F6]">
                    {currentTarget.count.toLocaleString()}명
                  </span>
                </motion.div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#3182F6] to-[#4294FF]"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100"
            >
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#3182F6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#191F28] mb-1">실시간 타겟팅</p>
                  <p className="text-xs text-[#8B95A1] leading-relaxed">
                    검색어, 구매내역, 앱 사용 패턴 등<br />
                    다양한 행동 데이터로 정확한 타겟을 찾습니다
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 5. Trust Indicators */}
        <section className="px-6 py-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[#191F28] mb-3 text-center">
              신뢰할 수 있는 데이터
            </h3>
            <p className="text-[#8B95A1] text-center mb-8">
              SK 그룹의 검증된 데이터 파트너십
            </p>

            <div className="space-y-6">
              {/* Partner Logos Carousel */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 py-8 border border-blue-100">
                <motion.div
                  className="flex gap-4"
                  animate={{
                    x: [0, -1440],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 25,
                      ease: "linear",
                    },
                  }}
                >
                  {/* First set */}
                  {[
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/d6e017d22_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/52658532b_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/ea2b39ecc_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/a82dc1a03_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/c57ecb9f9_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/808a1f123_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/d4da65185_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/ca70770a6_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/1b81d255f_image.png" },
                  ].map((brand, idx) => (
                    <div 
                      key={`first-${idx}`}
                      className="w-28 h-28 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-gray-100 bg-white overflow-hidden"
                    >
                      <img 
                        src={brand.img} 
                        alt="Partner Logo"
                        className="w-full h-full object-contain p-3"
                      />
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {[
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/d6e017d22_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/52658532b_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/ea2b39ecc_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/a82dc1a03_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/c57ecb9f9_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/808a1f123_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/d4da65185_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/ca70770a6_image.png" },
                    { img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690ca08f00a852116a9c9752/1b81d255f_image.png" },
                  ].map((brand, idx) => (
                    <div 
                      key={`second-${idx}`}
                      className="w-28 h-28 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-gray-100 bg-white overflow-hidden"
                    >
                      <img 
                        src={brand.img} 
                        alt="Partner Logo"
                        className="w-full h-full object-contain p-3"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3182F6] to-[#4294FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#191F28] leading-relaxed">
                      <span className="font-bold text-[#3182F6]">픽서치는 SK 그룹 94% 이상의 회사들</span>로부터 비식별 데이터를 공급 받고 있습니다.
                      <br />
                      커머스부터 모바일 방송까지 다양한 서비스의 이용 행태를 DMP에 담아
                      <br />
                      <span className="font-bold text-[#3182F6]">1.3억개의 ADID와 쿠키 ID</span>를 보유하고 있습니다.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* 6. Pricing */}
        <section className="px-6 py-12 bg-gradient-to-b from-white to-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[#191F28] mb-3 text-center">
              투명한 가격
            </h3>
            <p className="text-[#8B95A1] text-center mb-8">
              숨은 비용 없이 명확하게
            </p>

            <div className="space-y-3">
              {[
                { name: 'Basic', price: '240,000', desc: '대중 대상 / 공공 설문', color: 'blue' },
                { name: 'Standard', price: '300,000', desc: '일반 브랜드 타겟팅', color: 'purple' },
                { name: 'Premium', price: '350,000', desc: '커머스 / 랜딩페이지 연결', color: 'orange', badge: '인기' },
                { name: 'VIP', price: '500,000', desc: '초정밀 타겟팅', color: 'pink' },
              ].map((plan, idx) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 20px 40px rgba(49, 130, 246, 0.15)",
                  }}
                  className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${
                    plan.badge ? 'border-[#3182F6]' : 'border-gray-100'
                  } relative cursor-pointer transition-all`}
                >
                  {plan.badge && (
                    <motion.div 
                      className="absolute -top-3 right-4"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Badge className="bg-[#3182F6] text-white border-0 shadow-md">
                        {plan.badge}
                      </Badge>
                    </motion.div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#191F28] text-lg mb-1">{plan.name}</p>
                      <p className="text-xs text-[#8B95A1]">{plan.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#3182F6]">{plan.price}</p>
                      <p className="text-xs text-[#8B95A1]">KRW</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#3182F6] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#191F28] mb-1">무료 체험 가능</p>
                  <p className="text-sm text-[#8B95A1]">
                    2 서치코인으로 무료설문을 만들어보세요
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 7. Footer */}
        <footer className="px-6 py-12 pb-28 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2 text-left text-xs text-[#8B95A1] leading-relaxed">
            <p><span className="font-medium text-[#191F28]">대표자</span> 이시우</p>
            <p><span className="font-medium text-[#191F28]">상호</span> 주식회사 픽켓팅</p>
            <p><span className="font-medium text-[#191F28]">주소</span> 서울시 서울특별시 금천구 가산디지털2로 143 508호</p>
            <p><span className="font-medium text-[#191F28]">사업자번호</span> 165-88-03767</p>
            <p><span className="font-medium text-[#191F28]">통신판매업 신고번호</span> 2024-서울강남-07205호</p>
            <p><span className="font-medium text-[#191F28]">개인정보 보호책임자</span> 심민우</p>
            <p><span className="font-medium text-[#191F28]">제휴문의</span> biz@picketing.ai</p>
            <p><span className="font-medium text-[#191F28]">대표번호</span> 070-4300-0829</p>
            <p className="text-xs pt-3">© 2025 Pick Search. All rights reserved.</p>
          </div>
        </footer>

        {/* Floating CTA Button */}
        <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none px-4">
          <div className="max-w-[440px] mx-auto pointer-events-auto">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.05,
                y: -4,
                boxShadow: "0 20px 40px -10px rgba(49, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95, y: 0 }}
            >
              <Button 
                onClick={handleKakaoLogin}
                className="w-full h-14 bg-gradient-to-r from-[#3182F6] to-[#4294FF] hover:from-[#2868d8] hover:to-[#3182F6] text-white font-bold rounded-full shadow-[0_10px_30px_-5px_rgba(49,130,246,0.3)] text-base transition-all duration-300"
              >
                카카오톡으로 시작하기
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
