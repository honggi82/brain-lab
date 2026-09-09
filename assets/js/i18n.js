(function () {
  'use strict';
  var translations = {
  "뇌 해부도로 이동": "Skip to brain atlas",
  "뇌 해부도 — BRAIN Lab.": "Brain Atlas — BRAIN Lab.",
  "연구 분야": "Research Areas",
  "뇌 해부도": "Brain Atlas",
  "(785명 중 20명)": "(20 of 785)",
  "(817명 중 25명)": "(25 of 817)",
  "(826명 중 20명)": "(20 of 826)",
  "/ 갤러리": "/ Gallery",
  "/ 게시판": "/ News",
  "/ 교수 소개": "/ Professor",
  "/ 구성원": "/ Members",
  "/ 논문": "/ Publications",
  "/ 연구실 소개": "/ About the Lab",
  "/ 장비": "/ Equipment",
  "/ 프로젝트": "/ Projects",
  "16GB, 2대": "16 GB each, 2 units",
  "2008 한국지능시스템학회 추계학술대회, 진주.": "2008 KIIS Fall Conference, Jinju.",
  "2008 한국지능시스템학회 춘계학술대회, 충주.": "2008 KIIS Spring Conference, Chungju.",
  "2009 한국지능시스템학회 추계학술대회, 제주.": "2009 KIIS Fall Conference, Jeju.",
  "2009 한국지능시스템학회 춘계학술대회, 수원.": "2009 KIIS Spring Conference, Suwon.",
  "2017 한국지능시스템학회 추계학술대회, 여수.": "2017 KIIS Fall Conference, Yeosu.",
  "2018 한국지능시스템학회 추계학술대회, 원주.": "2018 KIIS Fall Conference, Wonju.",
  "2018 한국지능시스템학회 춘계학술대회, 여수.": "2018 Spring Conference of the Korean Institute of Intelligent Systems (KIIS), Yeosu.",
  "2018·2022·2023 등 다수 수상": "Awarded multiple times, including 2018, 2022, and 2023",
  "2019.1 – 현재": "2019.1 – Present",
  "2020 한국지능시스템학회 추계학술대회, 전주.": "2020 Korean Institute of Intelligent Systems (KIIS) Fall Conference, Jeonju.",
  "2020년 논문이 신경과학 분야 Top 100에 선정": "2020 paper named one of Scientific Reports' Top 100 in Neuroscience",
  "2021 Online KHBM Summer School 안내": "2021 Online KHBM Summer School",
  "2021 한국지능시스템학회 추계학술대회, 광주.": "2021 Korean Institute of Intelligent Systems (KIIS) Fall Conference, Gwangju.",
  "2021년 8월 26–27일 대한뇌기능매핑학회(KHBM)에서 ‘2021 Online KHBM Summer School’을 진행합니다.\n              염홍기 교수가 ‘EEG Analysis using MATLAB’를 주제로 강연합니다. 뇌파분석에 관심 있는 분은 아래에서 신청하세요.": "The Korean Society for Human Brain Mapping (KHBM) will hold its 2021 Online Summer School on August 26–27. Professor Hong Gi Yeom will give a lecture on ‘EEG Analysis using MATLAB.’ If you are interested in EEG analysis, please register below.",
  "2023.9 – 현재": "2023.9 – Present",
  "2024.1 – 현재": "2024.1 – Present",
  "2025.10 – 현재": "2025.10 – Present",
  "2026.6 – 현재": "2026.6 – Present",
  "22년 하반기 경찰공무원 경력경쟁채용(뇌파분석관) 공고 안내": "Police Recruitment for EEG Analysts — Second Half of 2022",
  "3차원 공간 인식 및 거리 측정 센서": "Sensor for 3D spatial mapping and distance measurement",
  "6단계 분석 파이프라인": "A Six-Step Analysis Pipeline",
  "6시간짜리 유튜브 강의인데 주요 내용을 잘 설명해 줍니다. 파이썬을 알더라도 복습 차원에서 들어보면 좋고,\n              아는 내용은 건너뛰며 목차에서 필요한 개념만 골라 들어도 좋습니다.": "This six-hour YouTube course explains the key concepts clearly. It is also a useful refresher if you already know Python. You can use the chapter list to skip familiar topics and focus on the concepts you need.",
  "AI 분석 기반 뇌 신호처리 메커니즘 규명 및 뇌 신호 자동 분석 딥러닝 알고리즘 개발": "Using AI to Investigate Brain Signal Processing Mechanisms and Develop Deep Learning Algorithms for Automated Brain Signal Analysis",
  "AI 의도 예측": "AI-Based Intention Prediction",
  "AI가 뇌 신호를 해독하는 개념 이미지": "Illustration of AI decoding brain signals",
  "AI가 뇌를 수학적으로 모델링하며 발전해온 것처럼, 뇌 연구는 의학·신경과학뿐 아니라 공학·경제학·심리학의 근간이 됩니다.\n            다양한 뇌 연구를 통해 뇌가 동작하는 메커니즘을 규명합니다.": "Mathematical models of the brain have helped shape the development of AI. Brain research also underpins advances in medicine, neuroscience, engineering, economics, and psychology. Through our research, we seek to understand the mechanisms that govern how the brain works.",
  "AI를 통해 의도를 예측한다": "Using AI to predict intentions",
  "Ace Best Teacher Award, 조선대학교": "Ace Best Teacher Award, Chosun University",
  "Award for the Best Teacher, 조선대학교": "Award for the Best Teacher, Chosun University",
  "B.S., 전자전기공학부": "B.S., School of Electrical and Electronic Engineering",
  "BCI 기반 이동·제어 연구용 전동휠체어": "Powered wheelchair for BCI-based mobility and control research",
  "BCI 기본 원리": "BCI Fundamentals",
  "BCI 이야기 — 뉴런에서 세상 제어까지": "The BCI Story — From Neurons to Interacting with the World",
  "BRAIN Lab. — 뇌 및 인공지능 연구실": "BRAIN Lab. — Brain and Artificial Intelligence Laboratory",
  "BRAIN Lab. — 뇌 및 인공지능 연구실 | 조선대학교": "BRAIN Lab. — Brain and Artificial Intelligence Laboratory | Chosun University",
  "BRAIN Lab. 뇌 및 인공지능 연구실": "BRAIN Lab. Brain and Artificial Intelligence Laboratory",
  "BRAIN Lab. 홈": "BRAIN Lab. Home",
  "BRain And IntelligeNce Lab. · 조선대학교 IT융합대학": "BRain And IntelligeNce Lab. · College of IT Convergence, Chosun University",
  "Committee, 대한인간뇌지도학회(KHBM)": "Committee Member, Korean Society for Human Brain Mapping (KHBM)",
  "Completed · 완료": "Completed",
  "Compumedics Grael LT 디지털 EEG 전체 시스템": "Complete Compumedics Grael LT Digital EEG System",
  "Director for Education, 한국지능시스템학회(KIIS)": "Director for Education, Korean Institute of Intelligent Systems (KIIS)",
  "Director of Public Relations, 한국지능시스템학회(KIIS)": "Director of Public Relations, Korean Institute of Intelligent Systems (KIIS)",
  "EEG 장비로 뇌파를 측정하는 개념 이미지": "Illustration of EEG equipment recording brain activity",
  "EEG로 뇌파를 측정하다": "Recording brain activity with EEG",
  "Excellent Paper Award, 한국지능시스템학회(KIIS) 추계": "Excellent Paper Award, Korean Institute of Intelligent Systems (KIIS) Fall Conference",
  "Excellent Paper Award, 한국지능시스템학회(KIIS) 춘계": "Excellent Paper Award, Korean Institute of Intelligent Systems (KIIS) Spring Conference",
  "Excellent Presentation Award, 대한인간뇌지도학회(KHBM)": "Excellent Presentation Award, Korean Society for Human Brain Mapping (KHBM)",
  "Executive Director, 광주전남지부, ICROS": "Executive Director, Gwangju-Jeonnam Branch, ICROS",
  "Gospel · 복음 이야기 보기": "Explore the Gospel Message",
  "Grael LT 39채널 EEG 증폭기": "Grael LT 39-Channel EEG Amplifier",
  "H. G. Yeom, I. H. Jang, K. B. Sim. “Broca 영역에서의 뇌파 변화에 기반한 뇌-컴퓨터 인터페이스.”": "H. G. Yeom, I. H. Jang, K. B. Sim. “Brain-Computer Interface Based on EEG Changes in Broca’s Area.”",
  "H. G. Yeom, K. B. Sim. “Variance-Considered Machine에 기반한 Brain-Computer Interface 시스템의 성능 향상.”": "H. G. Yeom, K. B. Sim. “Performance Improvements of Brain-Computer Interface Systems based on Variance-Considered Machines.”",
  "H. G. Yeom. “실생활 사용을 위한 뇌-컴퓨터 인터페이스 연구동향.”": "H. G. Yeom. “Research Trends in Brain-Computer Interfaces for Real-World Use.”",
  "Hong Gi Yeom (염홍기)": "Hong Gi Yeom",
  "K. B. Sim, H. G. Yeom, I. Y. Lee. “뇌와 컴퓨터의 인터페이스를 위한 뇌파 측정 및 분석 방법.”": "K. B. Sim, H. G. Yeom, I. Y. Lee. \"Brain and Computer Interface (BCI) for Brainwave Measurement and Analysis.\"",
  "KR 10-1081369 · 2011.11.02 (등록)": "KR 10-1081369 · 2011.11.02 (Registered)",
  "KR 10-1238780 · 2013.02.25 (등록)": "KR 10-1238780 · 2013.02.25 (Registered)",
  "KR 10-1314570 · 2013.09.27 (등록)": "KR 10-1314570 · 2013.09.27 (Registered)",
  "KR 10-1585150 · 2016.01.07 (등록)": "KR 10-1585150 · 2016.01.07 (Registered)",
  "KR 10-1618186 · 2016.04.28 (등록)": "KR 10-1618186 · 2016.04.28 (Registered)",
  "KR 10-1643354 · 2016.07.21 (등록)": "KR 10-1643354 · 2016.07.21 (Registered)",
  "KR 10-1740894 · 2017.05.23 (등록)": "KR 10-1740894 · 2017.05.23 (Registered)",
  "KR 10-2557024 · 2023.07.13 (등록)": "KR 10-2557024 · 2023.07.13 (Registered)",
  "KR 10-2589345 · 2023.10.10 (등록)": "KR 10-2589345 · 2023.10.10 (Registered)",
  "KR 10-2859360 · 2025.09.09 (등록)": "KR 10-2859360 · 2025.09.09 (Registered)",
  "KR 10-2958817 · 2026.04.24 (등록)": "KR 10-2958817 · 2026.04.24 (Registered)",
  "M.S. Student · 휴학": "M.S. Student · On Leave",
  "M.S., 전자전기공학부": "M.S., School of Electrical and Electronic Engineering",
  "Ongoing · 진행중": "Ongoing",
  "OpenBCI All-in-One 16채널 EEG 전극 캡": "OpenBCI All-in-One 16-channel EEG Electrode Cap",
  "Ph.D., 뇌과학협동과정": "Ph.D., Interdisciplinary Program in Neuroscience",
  "Python 온라인 강의 공유": "Online Python Course",
  "S. M. Park, K. B. Sim, H. G. Yeom. “컨볼루션 신경망 기반 운동심상을 이용한 뇌의 연결성 분석 및 분류방법.”": "S. M. Park, K. B. Sim, H. G. Yeom. “Analysis of Brain Connectivity and Classification Methods Using Convolutional Neural Networks Based on Motor Imagery.”",
  "SK에서 제공하는 T아카데미 동영상 강의로, 다양한 인공지능 알고리즘과 프로그래밍 강의가 있습니다.": "SK's T Academy offers video courses on AI algorithms and programming.",
  "Unicorn Hybrid Black 8채널 무선 건식 전극 EEG 시스템": "Unicorn Hybrid Black 8-channel Wireless Dry Electrode EEG System",
  "VR·MR 실험용 헤드 마운트 디스플레이": "Head-mounted display for VR and mixed reality experiments",
  "Velodyne VLP-16 Puck M12 LiDAR 센서": "Velodyne VLP-16 Puck M12 LiDAR Sensor",
  "W. S. Choi, H. G. Yeom. “단일 인공신경망 모델을 이용한 다중의도 예측 뇌-컴퓨터 인터페이스.”": "W. S. Choi, H. G. Yeom. \"Interpreting Multiple Intentions in Brain-Computer Interfaces using a Single Artificial Neural Network Model.\"",
  "Y. J. Kim, S. W. Park, W. S. Kim, H. G. Yeom, et al. “로봇 팔의 뇌 신호로부터 유도된 3D 좌표 추적을 위한 Guidance Law 적용에 관한 연구.”": "Y. J. Kim, S. W. Park, W. S. Kim, H. G. Yeom, et al. “A Study on Applying Guidance Laws in Developing Algorithm which Enables Robot Arm to Trace 3D Coordinates Derived from Brain Signal.”",
  "Young Investigator Award, 한국지능시스템학회(KIIS) 추계": "Young Investigator Award, Korean Institute of Intelligent Systems (KIIS) Fall Conference",
  "Zortrax M200 3D 프린터": "Zortrax M200 3D Printer",
  "nreal air ar 증강현실 글래스": "Nreal Air AR Glasses",
  "— 염홍기 (Hong Gi Yeom), BRAIN Lab.": "— Hong Gi Yeom, BRAIN Lab.",
  "“AI Principles & Research Trends in BCI” · 동서대학교": "\"AI Principles & Research Trends in BCI\" · Dongseo University",
  "“Brain Mechanism and Applications” · 한국지능시스템학회": "“Brain Mechanism and Applications” · Korean Institute of Intelligent Systems (KIIS)",
  "“Future of Brain-Computer Interfaces” · 한국과학기술단체총연합회(KOFST)": "“Future of Brain-Computer Interfaces” · Korean Federation of Science and Technology Societies (KOFST)",
  "“Intelligent Brain-Computer Interface” · 공주대학교": "\"Intelligent Brain-Computer Interface\" · Kongju National University",
  "“Introduction to Brain-Machine Interface” · 전남대학교 의과대학": "\"Introduction to Brain-Machine Interface\" · Chonnam National University School of Medicine",
  "“Machine Learning and BCIs” · 한국뇌파연구회": "\"Machine Learning and BCIs\" · Korean Neurometric Research Association",
  "“Prediction of Reaching Movements” · 대한뇌파신경생리학회": "“Prediction of Reaching Movements” · Korean Society for EEG and Neurophysiology",
  "“Studies for Practical BMI systems” · 한동대학교": "\"Studies for Practical BMI systems\" · Handong Global University",
  "“Top 100 in Neuroscience” 선정 ·": "Top 100 in Neuroscience selection ·",
  "가": "​",
  "가상 뇌": "Virtual Brain",
  "가상 환경과 현실의 기기를 연결하다": "Connecting Virtual Environments with Real-World Devices",
  "갈릴리의 따뜻한 햇빛 아래 두 팔을 벌려 환영하는 예수님": "Jesus welcoming visitors with open arms in the warm sunlight of Galilee",
  "갤러리": "Gallery",
  "갤러리 — BRAIN Lab.": "Gallery — BRAIN Lab.",
  "게시판": "News",
  "게시판 — BRAIN Lab.": "News & Announcements — BRAIN Lab.",
  "공간필터를 이용한 뇌-기계 인터페이스 시스템 및 방법": "Brain-Machine Interface Systems and Methods Using Spatial Filters",
  "공동연구자": "Co-Investigator",
  "공지": "Notice",
  "과": "​",
  "과학기술정보통신부에서 주최하는 뇌 연구 촉진 기본 계획 공청회입니다.\n              앞으로 뇌 연구를 어떻게 지원할지 발표·토론하는 자리이니 관심 있는 학생들은 참고하세요.": "The Ministry of Science and ICT is hosting a public hearing on its basic plan for promoting brain research. The hearing will include presentations and discussions on future support for brain research. Students interested in the field are welcome to learn more.",
  "광주광역시 동구 필문대로 309": "309 Pilmun-daero, Dong-gu, Gwangju",
  "교수": "Professor",
  "교수 소개": "About the Professor",
  "교수 소개 — 염홍기 | BRAIN Lab.": "Professor — Hong Gi Yeom | BRAIN Lab.",
  "교수 수상·특허 전체 보기": "View the Professor's Awards and Patents",
  "구성원": "Members",
  "구성원 — BRAIN Lab.": "Members — BRAIN Lab.",
  "국가AI전략위원회": "National AI Strategy Committee",
  "국내 저널": "Korean Journals",
  "국내 특허": "Korean Patents",
  "국내 학회": "Conferences in Korea",
  "국제 저널": "International Journals",
  "국제 학회": "International Conferences",
  "군집화": "Clustering",
  "그 외 다수의 국내 대학·연구기관 초청 강연.": "Additional invited talks at universities and research institutions across Korea.",
  "기기 제어": "Device Control",
  "기능적 연결성": "Functional Connectivity",
  "기독교가 비과학적이라고 생각하신다면, ‘진화론이 왜 말이 안 되는지’에 대한 제 생각도\n          다른 영상에 올려두었으니 함께 시청 부탁드립니다.": "If you think Christianity is unscientific, I have also shared my thoughts on ‘why evolution does not make sense’ in another video. I invite you to watch that as well.",
  "김": "Kim",
  "김진성": "Kim Jin-sung",
  "김창환": "Kim Chang-hwan",
  "김혜인": "Kim Hye-in",
  "논문": "Publications",
  "논문 & 학술 발표": "Publications & Conference Presentations",
  "논문 — BRAIN Lab.": "Publications — BRAIN Lab.",
  "뇌": "Brain",
  "뇌 메커니즘": "Brain Mechanisms",
  "뇌 및 인공지능 연구실 게시판 — 공지사항, 연구실 소식, 논문·수상 소식.": "News from BRAIN Lab.: announcements, lab updates, publications, and awards.",
  "뇌 및 인공지능 연구실 구성원 — 박사·석사·학부 연구원 및 졸업생.": "Meet the Ph.D. students, master's students, undergraduate researchers, and alumni of BRAIN Lab.",
  "뇌 및 인공지능 연구실 논문 — 국제·국내 저널 및 학회 발표.": "Journal articles and conference presentations by BRAIN Lab., published in Korea and internationally.",
  "뇌 및 인공지능 연구실(BRAIN Lab.) 소개 — 세계가 주목하는 뇌 과학, 미래 핵심 기술 BCI, 그리고 세 개의 연구 축.": "About BRAIN Lab.: growing worldwide interest in brain science, the potential of brain–computer interfaces, and our three research areas.",
  "뇌 및 인공지능 연구실(BRAIN Lab.)은 사람에게 도움을 주는 선한 기술을 개발하는 것을 목적으로\n          뇌-컴퓨터 인터페이스, 인공지능, 뇌 메커니즘을 연구하고 있습니다.": "At the Brain and Artificial Intelligence Laboratory (BRAIN Lab.), we study brain–computer interfaces, artificial intelligence, and the mechanisms of the brain to develop technology that helps people.",
  "뇌 및 인공지능 연구실은 Brain-Computer Interface(BCI),\n        Artificial Intelligence, Brain Mechanism을 연구합니다. 뇌를 이해하고, 지능을 설계하며, 사람을 돕는 기술로 잇습니다.": "At BRAIN Lab., we study brain–computer interfaces (BCIs), artificial intelligence, and the mechanisms of the brain. We bring together an understanding of the brain and the design of intelligent systems to develop technology that helps people.",
  "뇌 및 인공지능 연구실의 일상과 학회 활동 사진.": "Photos of everyday life and conference activities at BRAIN Lab.",
  "뇌 및 인공지능 연구실의 진행 중·완료 프로젝트.": "Ongoing and completed research projects at BRAIN Lab.",
  "뇌 속 뉴런들이 서로 신호를 주고 받는다": "Neurons in the brain exchange signals.",
  "뇌 신호 해독을 통한 BCI-Musicing 시스템 개발": "Development of a BCI-Musicing System through Brain Signal Decoding",
  "뇌 신호에서 의미를 읽어내기 위한 연구실의 표준 분석 흐름입니다.": "Our standard workflow for extracting meaningful information from brain signals.",
  "뇌 연결성에 기반한 멀티모드 뇌-컴퓨터 인터페이스 시스템": "Multimodal Brain-Computer Interface Systems Based on Brain Connectivity",
  "뇌 연구 촉진 기본 계획 공청회 안내": "Public Hearing on the Basic Plan for Promoting Brain Research",
  "뇌-기계 인터페이스 기반 재활 로봇 제어 시스템 및 제어방법": "Rehabilitation Robot Control Systems and Methods Based on Brain-Machine Interface",
  "뇌-컴퓨터 인터페이스": "Brain-Computer Interface",
  "뇌-컴퓨터 인터페이스, 신경 신호 디코딩, 기계학습에 관한 국제·국내 저널 논문과 학회 발표입니다.": "International and Korean journal articles and conference presentations on brain-computer interfaces, neural signal decoding, and machine learning.",
  "뇌-컴퓨터 인터페이스, 인공지능, 뇌 메커니즘 · 조선대학교 염홍기 교수 연구실": "Brain–computer interfaces, artificial intelligence, and brain mechanisms · Professor Hong Gi Yeom's laboratory at Chosun University",
  "뇌·인공지능 연구에 관심 있는 학생이라면 언제든 편하게 연락 주세요.\n            함께 성장할 연구자를 기다립니다.": "If you are interested in brain science and AI, please feel free to get in touch. We welcome students who want to learn and grow with us.",
  "뇌·인공지능 연구에 함께할 학생을 언제나 환영합니다.": "We welcome students interested in joining our research in brain science and AI.",
  "뇌와 인공지능을 향한 호기심으로 모인 연구원들입니다.": "We are a team of researchers brought together by a shared curiosity about the brain and artificial intelligence.",
  "뇌와 인공지능이 궁금하다면, 전공이나 배경과 무관하게 편하게 연락 주세요.": "If you are curious about the brain and AI, we would love to hear from you, whatever your major or background.",
  "뇌의 내부 (백색질 신경섬유)가 어떻게 연결되어 있는지를 보여주는 DTI 이미지입니다. 데이터: HCP-1065 집단 평균 확산 MRI 트랙토그래피 아틀라스(24,207 신경섬유, ICBM-2009a) —": "This DTI visualization shows connections within the brain's white matter. Data: HCP-1065 population-averaged diffusion MRI tractography atlas (24,207 streamlines, ICBM-2009a) —",
  "뇌의 전기 신호를 측정하고 해독하여, 전자기기를 제어하기까지 — BCI의 네 단계.": "From recording and decoding the brain's electrical signals to controlling electronic devices: the four stages of a BCI.",
  "뇌의 전기 신호를 측정하다": "Recording the Brain's Electrical Signals",
  "뇌의 활동을": "Brain Activity",
  "뇌파": "EEG",
  "뇌파 분석을 담당할 경찰공무원을 채용한다고 합니다. 뇌파분석에 관심 있는 분들은 향후 진로 결정에 참고하세요.": "The police are recruiting officers to work in EEG analysis. If you are interested in the field, this announcement may help you explore potential career paths.",
  "뇌파 측정": "EEG Recording",
  "뇌파 측정부터 인공지능 연산, 가상·증강현실, 이동 보조기기와 공간 인식까지 연구에 활용하는 장비를 소개합니다.": "Explore the equipment that supports our research, from EEG recording and AI computing to virtual and augmented reality, mobility aids, and spatial sensing.",
  "뇌파를 이용한 본인 인증 시스템 및 방법": "Authentication System and Method Using EEG",
  "뇌파를 측정·분석해 사용자의 의도를 인식하고, 이를 토대로 로봇이나 컴퓨터를 제어합니다.\n            움직임 없이 생각만으로 기기를 제어할 수 있어 지체 장애인에게는 절대적으로 필요한 기술이며, 비장애인에게도 매우 유용한 기술입니다.": "We record and analyze brain signals to identify a user's intentions and use them to control robots and computers. By enabling device control through thought alone, without physical movement, BCIs can provide essential support for people with mobility impairments and useful applications for others as well.",
  "뉴런": "Neurons",
  "뉴런과 뇌": "Neurons and the Brain",
  "뉴런에서 전기 신호가 발생하는 개념 이미지": "Illustration of neurons generating electrical signals",
  "는 수많은": " Is Made of Countless",
  "다기능 뇌 컴퓨터 인터페이스 장치 및 방법": "Multifunctional Brain-Computer Interface Devices and Methods",
  "다음": "Next",
  "다음 구성원은 당신입니다": "You Could Be Our Next Team Member",
  "닫기": "Close",
  "대역 필터링": "Bandpass Filtering",
  "대통령 직속 국가인공지능전략위원회 자문위원": "Advisor, Presidential National AI Strategy Committee",
  "대통령 직속 국가인공지능전략위원회의 자문위원으로 위촉되어 국가 AI 전략 수립에 참여합니다.": "Professor Hong Gi Yeom has been appointed as an advisor to the Presidential National AI Strategy Committee, contributing to the development of national AI strategy.",
  "대표 논문 최고 IF 9.8 (Scientific Data) ·": "Selected publications include a paper in Scientific Data (IF 9.8) ·",
  "데이터를 학습하고 의도를 예측하다": "Learning from Data to Predict Intentions",
  "두피에 부착한 EEG 전극으로 뇌가 만들어내는 미세한 전기 신호를 실시간으로 측정합니다.": "EEG electrodes placed on the scalp record the brain's faint electrical signals in real time.",
  "들로 구성 됩니다": "​",
  "들어봐야 할 이야기": "A Message Worth Hearing",
  "등에 게재되었습니다.": "Published in",
  "라이트/다크 전환": "Toggle Light/Dark Mode",
  "라이트·다크 전환": "Toggle Light/Dark Mode",
  "로": "​",
  "로보휠 플러스": "RoboWheel Plus",
  "로보휠 플러스 전동휠체어": "RoboWheel Plus Powered Wheelchair",
  "멀티 스케일 뇌 운동 메커니즘 규명을 통한 고성능 BCI 시스템 개발": "Development of High-Performance BCI Systems through Multiscale Investigation of Neural Mechanisms of Movement",
  "메뉴 열기": "Open Menu",
  "문준민": "Moon Jun-min",
  "문준민·김혜인·박은선 · 2019": "Moon Jun-min, Kim Hye-in, Park Eun-seon · 2019",
  "미국 오바마 대통령은 2013년 뇌 연구의 중요성을 강조하며": "In 2013, US President Barack Obama highlighted the importance of brain research and proposed the",
  "미래 핵심 기술, 뇌-컴퓨터 인터페이스": "Brain–Computer Interfaces: A Key Technology for the Future",
  "박사 과정": "Ph.D. Students",
  "박성민": "Park Seong-min",
  "박은선": "Park Eun-seon",
  "복음 이야기": "The Gospel Message",
  "복음 이야기 영상": "Watch the Gospel Message",
  "본문으로 건너뛰기": "Skip to Main Content",
  "부교수": "Associate Professor",
  "분산분석 기반 뇌파 분석 장치 및 방법": "Brainwave Analysis Device and Method Based on ANOVA",
  "빛나는 뇌와 뇌파·연결성 네트워크를 형상화한 뇌 과학 연구 개념 이미지": "Illustration of brain science research, showing a glowing brain, brainwaves, and connectivity networks",
  "사람에게 도움이 되는": "Technology that helps people",
  "사람에게 도움이 되는 선한 기술을 연구합니다.": "We develop technology for good — technology that helps people.",
  "사람이 생각하고 움직일 때 수많은 뉴런들이 서로 신호를 주고 받으며 미세한 전기 신호를 생성합니다.": "When we think and move, networks of neurons exchange signals, generating tiny electrical currents.",
  "살면서 꼭 한번은": "At Least Once in Your Life",
  "삼성 HMD Odyssey": "Samsung HMD Odyssey",
  "삼성 HMD Odyssey 혼합현실 헤드셋": "Samsung HMD Odyssey Mixed Reality Headset",
  "삼성전자 · ICT 창의과제": "Samsung Electronics · ICT Creative Project",
  "생각만으로 로봇·휠체어·전자기기를 제어하는 뇌-컴퓨터 인터페이스 개념 이미지": "Illustration of a brain–computer interface controlling robots, wheelchairs, and other devices through thought",
  "생각으로": "Control",
  "생각으로 기기를 제어하는 개념 이미지": "Conceptual image of controlling devices by thought",
  "생체신호의 특징 추출 장치 및 방법": "Device and Method for Extracting Features from Biosignals",
  "서울대학교": "Seoul National University",
  "서울대학교 의학연구원": "Medical Research Center, Seoul National University",
  "석사 과정": "Master's Students",
  "선한 기술": "Technology for Good",
  "선한 연구를, 함께": "Research for Good, Together",
  "세 개의 연구 축": "Three Research Pillars",
  "세 개의 축으로 뇌와 지능을 탐구합니다": "Exploring the Brain and Intelligence through Three Research Areas",
  "세계적으로 주목받는 뇌 과학": "Brain Science in the Global Spotlight",
  "세상": "the World",
  "소개": "About",
  "소식": "News",
  "소통합니다": "with Thought",
  "수상": "Awards",
  "시각화": "Visualization",
  "시드니 국제 학회에서 염홍기 교수와 최우성 연구원": "Professor Hong Gi Yeom and researcher Woo-Sung Choi at an international conference in Sydney",
  "신호를 측정하고,": "Measure signals,",
  "앞 ↔ 뒤": "Front ↔ Back",
  "연구 경력": "Research Experience",
  "연구 살펴보기": "Explore Research",
  "연구 장비 — BRAIN Lab.": "Research Equipment — BRAIN Lab.",
  "연구실 공지사항과 소식, 논문·수상 소식을 전합니다.": "Updates from the lab, including announcements, publications, and awards.",
  "연구실 단체 사진": "Laboratory Group Photo",
  "연구실 문의": "Contact the Lab",
  "연구실 문의하기": "Contact the Lab",
  "연구실 소개": "About the Lab",
  "연구실 소개 — BRAIN Lab.": "About — BRAIN Lab.",
  "연구실 소개 인트로 DTI 신경섬유": "DTI visualization of white matter pathways",
  "연구실 소개 자세히 보기": "Learn More About the Lab",
  "연구실 소식·공지 게시판입니다. 실시간 글쓰기·댓글이 필요하시면 GitHub Discussions 기반으로 확장할 수 있습니다.": "This board shares lab news and announcements. It can be extended with GitHub Discussions to support real-time posting and comments.",
  "연구실 야외 활동": "Laboratory Outdoor Activities",
  "연구실 책임교수가 전하는 복음 이야기.": "A personal message about the Gospel from BRAIN Lab.'s principal investigator.",
  "연구실 학부생·대학원생이 국내외 학회에서 받은 상들입니다.": "Awards received by our undergraduate and graduate students at conferences in Korea and around the world.",
  "연구실 활동 사진": "Lab activities",
  "연구실을 거쳐 각자의 자리에서 성장하고 있는 학부 졸업생들입니다.": "Former undergraduate researchers who are continuing to grow in their chosen fields.",
  "연구실의 순간들": "Moments from Our Lab",
  "연구용 부품과 프로토타입 제작": "Fabrication of research components and prototypes",
  "연구원, Medical Research Center": "Researcher, Medical Research Center",
  "연구의 발자취": "Research Highlights",
  "연구책임자": "Principal Investigator",
  "연수연구원, Medical Research Center": "Trainee Researcher, Medical Research Center",
  "염홍기": "Hong Gi Yeom",
  "염홍기 (Hong Gi Yeom) · 조선대학교 부교수": "Hong Gi Yeom · Associate Professor, Chosun University",
  "염홍기 교수": "Professor Hong Gi Yeom",
  "염홍기 교수님 웰에이징ICT연구소 소장 임명": "Professor Hong Gi Yeom Appointed Director of the Well-Aging ICT Research Institute",
  "염홍기 교수님, 국가인공지능전략위원회 자문위원 위촉": "Professor Hong Gi Yeom Appointed Advisor to the National AI Strategy Committee",
  "염홍기(Hong Gi Yeom) 교수 — 조선대학교 부교수. 학력, 연구 경력, 학술 활동, 수상, 특허, 초청 강연.": "Hong Gi Yeom, Associate Professor at Chosun University: education, research experience, professional activities, awards, patents, and invited talks.",
  "영국 버밍엄대학교 방문교수(Visiting Professor)": "Visiting Professor, University of Birmingham",
  "영상 보기": "Watch Video",
  "예측 결과로 다양한 전자기기를 제어한다": "Using predicted intentions to control electronic devices",
  "예측된 의도가 제어 명령이 되어 6축 로봇팔과 전동휠체어 같은 다양한 전자기기를 제어합입니다.": "The predicted intentions are converted into commands that control devices such as six-axis robotic arms and powered wheelchairs.",
  "예측합니다": "Intent",
  "완료된 프로젝트": "Completed Projects",
  "우리 연구실은 하나님의 사랑을 실천하는 기독교 정신을 추구합니다. 하지만 크리스천이 아니어도\n          연구실에 들어올 수 있으며, 각 개인의 종교를 존중하고 다른 종교로 인한 불이익은 없습니다. 사람들에게 도움이\n          되는 선한 기술을 연구하며, 희망하는 경우 도움의 손길이 필요한 곳을 위해 함께 기도하거나 재정적 후원을 합니다.\n          그렇기에 대학원생 선발에 있어 실력도 중요하지만 인성을 매우 중요하게 생각합니다. 선한 연구를 함께 할 학생들은\n          편하게 연락 주세요.": "Our lab is guided by a Christian commitment to putting God's love into practice. We welcome people of all faiths and none, respect each person's beliefs, and do not discriminate on the basis of religion. We develop technology that helps people. Those who wish to may also join us in prayer or offer financial support to people in need. When selecting graduate students, we value character as well as academic and technical ability. If you would like to pursue research for good with us, please feel free to get in touch.",
  "우리 정부도 1998년 ‘뇌연구촉진법’을 제정해 기반을 마련했고,\n            2008년부터 ‘2단계 뇌 연구 촉진 계획’으로 뇌 연구를 발전시키고 있습니다.": "South Korea laid the groundwork for brain research with the Brain Research Promotion Act in 1998 and launched the second phase of its brain research promotion plan in 2008.",
  "우수논문상": "Best Paper Award",
  "원천 신호 추출": "Source Signal Extraction",
  "웨어러블 디바이스 기반 다중 생체 신호를 이용한 사용자 인증 기술": "User Authentication Using Multiple Biosignals from Wearable Devices",
  "웰에이징 ICT연구소 소장": "Director, Well-Aging ICT Research Institute",
  "웰에이징ICT연구소 설립": "Well-Aging ICT Research Institute Established",
  "위 ↔ 아래": "Up ↔ Down",
  "을 연구합니다": "studies",
  "의 “10대 유망기술”, 2014 다보스포럼의 “세계를 바꿀 10대 기술”,": "the \"Top 10 Promising Technologies\" of , 2014 Davos Forum's \"Top 10 Technologies to Change the World\"",
  "의 “21세기 8대 신기술”, CNN Business 2.0의 “세계를 바꿀 차세대 5대 기술”,\n            그리고 한국과학기술기획평가원(KISTEP)·삼성경제연구소의 “10대 국가유망미래기술” — BCI는 이 모든 목록에 이름을 올렸습니다.": "BCI has been included in all these lists: \"21st Century 8 Major New Technologies\" by CNN Business 2.0, \"Next-Generation 5 Major Technologies to Change the World\" by KISTEP, and \"10 Major National Promising Future Technologies\" by KISTEP and the Samsung Economic Research Institute.",
  "의공학회지 (JBER), 35(1), 50–54, 2014.": "Journal of Biomedical Engineering (JBER), 35(1), 50–54, 2014.",
  "의도를": "Predicts",
  "이 연구들의 성과, 논문에서 확인하기": "Explore the Publications from These Projects",
  "이메일 보내기": "Send email",
  "이전": "Previous",
  "이호준": "Lee Ho-jun",
  "인공지능": "Artificial Intelligence",
  "인공지능·프로그래밍 동영상 강의 사이트 공유": "Video Courses on AI and Programming",
  "인공지능을 활용한 다양한 뇌 연구를 수행하고자 웰에이징ICT연구소를 설립하였으며, 염홍기 교수님이 연구소 소장으로 임명되었습니다.": "The Well-Aging ICT Research Institute was established to support a broad range of brain research using AI. Professor Hong Gi Yeom was appointed director.",
  "인공지능이 복잡한 뇌파 패턴을 학습해 사용자가 무엇을 하려는지 실시간으로 예측합니다.": "AI learns patterns in complex EEG signals to predict what the user intends to do in real time.",
  "자료": "Resources",
  "장나영": "Jang Na-young",
  "장나영 · 2021": "Jang Na-young · 2021",
  "장나영 학생, 2021 제어로봇시스템학회 학술대회 학부생 논문상 수상": "Na-young Jang Wins Undergraduate Paper Award at ICROS 2021",
  "장나영 학생이 제어로봇시스템학회 2021년 학술대회(ICROS 2021)에서 “수면 동안 시간에 따른 뇌의 기능적 연결성 분석”\n              논문을 발표하여 학부생 논문상을 수상했습니다. 축하합니다!": "Na-young Jang received the Undergraduate Paper Award at ICROS 2021 for her presentation, ‘Analysis of Time-Varying Functional Brain Connectivity During Sleep.’ Congratulations!",
  "장려상": "Encouragement Award",
  "장비": "Equipment",
  "저널 논문": "Journal Articles",
  "저는 살면서 가장 중요한 것이 예수님을 믿고 구원받는 것이라고 생각합니다. 이곳을 방문해 주셨다면,\n          또 연구실에 관심이 있으시다면 아래 영상을 꼭 한번은 들어봐 주시기를 부탁드립니다.": "I believe that the most important thing in life is to believe in Jesus and receive salvation. Thank you for visiting this website and taking an interest in our lab. I would be grateful if you would take the time to watch the video below at least once.",
  "전체": "All",
  "전체 논문 보기": "View All Papers",
  "정밀한 제어를 위한 뇌-기계 인터페이스 장치 및 방법": "Brain-Machine Interface Devices and Methods for Precise Control",
  "정세훈": "Jung Se-hun",
  "정연비": "Jung Yeon-bi",
  "제34회 제어로봇시스템학회(ICROS 2019), 경주.": "The 34th Conference of the Institute of Control, Robotics, and Systems (ICROS 2019), Gyeongju.",
  "제35회 제어로봇시스템학회(ICROS 2020), 속초.": "The 35th Conference of the Institute of Control, Robotics, and Systems (ICROS 2020), Sokcho.",
  "제36회 제어로봇시스템학회(ICROS 2021), 여수.": "The 36th Conference of the Institute of Control, Robotics, and Systems (ICROS 2021), Yeosu.",
  "제어로봇시스템학회 ICROS 2021 —": "Conference on Control, Robotics, and Systems ICROS 2021 —",
  "제어로봇시스템학회 논문지, 25(9), 858–862, 2019.": "Journal of Control, Robotics, and Systems, 25(9), 858–862, 2019.",
  "조교수": "Assistant Professor",
  "조선대학교": "Chosun University",
  "조선대학교 IT융합대학 9120호": "Room 9120, College of IT Convergence, Chosun University",
  "조선대학교 IT융합대학 부교수 · 뇌 및 인공지능 연구실 책임교수": "Associate Professor, College of IT Convergence, Chosun University · Principal Investigator, BRAIN Lab.",
  "조선대학교 강의우수상": "Chosun University Teaching Excellence Award",
  "조선대학교 뇌 및 인공지능 연구실(BRAIN Lab.). 뇌-컴퓨터 인터페이스(BCI), 인공지능, 뇌 메커니즘을 연구하며 사람에게 도움이 되는 선한 기술을 만듭니다.": "BRAIN Lab. at Chosun University studies brain–computer interfaces, artificial intelligence, and the mechanisms of the brain to develop technology that helps people.",
  "조선대학교 뇌 및 인공지능 연구실의 EEG 측정 시스템, 서버, GPU, XR 기기, 전동휠체어, LiDAR, 3D 프린터 장비.": "Research equipment at BRAIN Lab., Chosun University: EEG systems, servers, GPUs, XR devices, powered wheelchairs, LiDAR sensors, and 3D printers.",
  "졸업생": "Alumni",
  "좌 ↔ 우": "Left ↔ Right",
  "주요 메뉴": "Main Menu",
  "준비전위기반 뇌-컴퓨터 인터페이스 장치 및 방법": "Readiness Potential-based Brain-Computer Interface Device and Method",
  "중심성": "Centrality",
  "중앙대학교": "Chung-Ang University",
  "증강현실 기반 자율주행 뇌-컴퓨터 인터페이스 시스템": "Augmented Reality-based Autonomous Driving Brain-Computer Interface System",
  "증강현실 실험용 글래스": "Glasses for augmented reality experiments",
  "증강현실을 이용한 다기능 뇌-컴퓨터 인터페이스 장치": "Multifunctional Brain-Computer Interface Device Using Augmented Reality",
  "지능을 구현하는 장비": "Equipment for Brain Science and AI Research",
  "진행 중인 프로젝트": "Ongoing Projects",
  "초청 강연": "Invited Talks",
  "최우성": "Woo-Sung Choi",
  "최우성 · 2020": "Woo-Sung Choi · 2020",
  "최우성 · 2023": "Woo-Sung Choi · 2023",
  "최우성 박사과정 학생, ISIS 2023 Best Presentation Award 수상": "Ph.D. Student Woo-Sung Choi Wins Best Presentation Award at ISIS 2023",
  "최우성 박사과정 학생이 The 24th International Symposium on Advanced Intelligent Systems(ISIS 2023)에서\n              Best Presentation Award를 수상했습니다. ISIS는 한국지능시스템학회(KIIS)와 일본 퍼지이론 및 지능정보학회(SOFT)가 격년으로 주최하는,\n              인공지능·지능시스템 분야의 전통 있는 국제학술대회입니다. 축하합니다!": "Ph.D. student Woo-Sung Choi won the Best Presentation Award at the 24th International Symposium on Advanced Intelligent Systems (ISIS 2023). ISIS is an established international conference on artificial intelligence and intelligent systems, held every two years and hosted alternately by the Korean Institute of Intelligent Systems (KIIS) and the Japan Society for Fuzzy Theory and Intelligent Informatics (SOFT). Congratulations!",
  "최우성 학생, 한국지능시스템학회 2021 추계학술대회 우수논문상 수상": "Woo-Sung Choi Wins Best Paper Award at the 2021 KIIS Fall Conference",
  "최우성 학생이 한국지능시스템학회 2021년 추계학술대회에서 “복합기능 뇌-컴퓨터 인터페이스” 논문을 발표하여\n              우수논문상을 수상했습니다. 축하합니다!": "Woo-Sung Choi received the Best Paper Award at the 2021 KIIS Fall Conference for his presentation on multifunctional brain–computer interfaces. Congratulations!",
  "측정합니다": "Measures",
  "컴퓨터가 스스로 학습하고 결정하여 지능적으로 일을 처리하도록 만드는 기술로, 주로 기계학습 및 딥러닝을 다룹니다.\n            새로운 AI 알고리즘의 개발 및 최신 AI 응용을 연구합니다.": "We study artificial intelligence that enables computers to learn, make decisions, and perform tasks intelligently. Our work focuses on machine learning and deep learning, including the development of new algorithms and applications of the latest AI methods.",
  "특허": "Patents",
  "특허 패밀리": "Patent Families",
  "포스텍이 운영하는 생명과학 연구자 교류의 장 BRIC의 ‘한빛사’에 염홍기 교수님의 논문이 소개되었습니다.\n              한빛사는 JCR(Journal Citation Reports™) 기준 IF 또는 5-Yr IF 10 이상, 혹은 분야 상위 3% 학술지에 게재된 논문을 소개하는 곳입니다.": "Professor Hong Gi Yeom's paper was featured in Hanbit-sa, a research showcase on BRIC, the life sciences community platform run by POSTECH. Hanbit-sa highlights papers published in journals with an impact factor or five-year impact factor of at least 10, or ranked in the top 3% of their field, based on Journal Citation Reports (JCR).",
  "표지 논문": "Cover Article",
  "프로젝트": "Projects",
  "프로젝트 — BRAIN Lab.": "Projects — BRAIN Lab.",
  "프로젝트를 제안하고\n            2014년 예산으로 약 1,100억 원(1억 달러)을 책정했습니다. 미국의 ‘뇌연구 10년(Decade of Brain)’, EU의 ‘유럽 뇌 연구 10년’,\n            G7 국가의 공동 인간 프론티어 과학 프로그램, 그리고 일본 정부의 20년간 약 30조 원(180억 달러) 투자 계획까지 —\n            세계는 막강한 지원으로 뇌 연구에 뛰어들고 있습니다.": "and allocated approximately KRW 110 billion (USD 100 million) in the 2014 budget. Other major commitments include the US Decade of the Brain, the European Decade of Brain Research, the G7's joint Human Frontier Science Program, and Japan's planned investment of approximately KRW 30 trillion (USD 18 billion) over 20 years. These initiatives reflect substantial international support for brain research.",
  "학력": "Education",
  "학부 연구원": "Undergraduate Researchers",
  "학부생 논문상": "Undergraduate Paper Award",
  "학생들의 수상": "Student Awards",
  "학술 발표": "Conference Presentations",
  "학술 활동": "Professional Activities",
  "학회, 세미나, 그리고 함께한 일상 — 연구 너머의 이야기입니다. 사진을 클릭하면 크게 볼 수 있습니다.": "Conferences, seminars, and everyday moments together — a glimpse of life beyond research. Click a photo to view it at full size.",
  "한국연구재단 · 개인기초연구사업": "National Research Foundation of Korea · Basic Research Program for Individual Researchers",
  "한국연구재단 · 생애 첫 연구사업": "National Research Foundation of Korea · First-Time Researcher Support Program",
  "한국연구재단 · 중점연구소지원사업": "National Research Foundation of Korea (NRF) · Core Research Center Support Program",
  "한국연구재단 · 지역대학우수과학자지원사업": "National Research Foundation of Korea (NRF) · Regional University Excellent Scientist Support Program",
  "한국정보과학회 KCC 2019 학부생 논문경진대회 —": "Korean Conference on Computing (KCC) 2019 Undergraduate Paper Competition —",
  "한국지능시스템학회 2020 추계학술대회 —": "Korean Institute of Intelligent Systems (KIIS) 2020 Fall Conference —",
  "한국지능시스템학회 논문지, 18(5), 605–610, 2008.": "Journal of Korean Institute of Intelligent Systems, 18(5), 605–610, 2008.",
  "한국지능시스템학회 논문지, 19(1), 122–127, 2009.": "Journal of Korean Institute of Intelligent Systems, 19(1), 122–127, 2009.",
  "한국지능시스템학회 논문지, 20(1), 153–158, 2010.": "Journal of Korean Institute of Intelligent Systems, 20(1), 153–158, 2010.",
  "한국지능시스템학회 논문지, 29(2), 124–129, 2019.": "Journal of Korean Institute of Intelligent Systems, 29(2), 124–129, 2019.",
  "한국지능시스템학회 논문지, 31(3), 206–212, 2021.": "Journal of Korean Institute of Intelligent Systems, 31(3), 206–212, 2021.",
  "한빛사(한국을 빛내는 사람들)에 염홍기 교수님 논문 소개": "Professor Hong Gi Yeom's Paper Featured in BRIC's Hanbit-sa",
  "한빛사에서 보기": "Read the Hanbit-sa Feature",
  "함께 연구하는 사람들": "Meet Our Team",
  "함께 연구할 학생을 찾습니다": "Join Our Research Team",
  "함께하기": "Join Us",
  "해석 가능한 임베딩 사전 기반 BCI 파운데이션 모델 및 24시간 동작 멀티모달 BCI 에이전트 개발": "Development of a BCI Foundation Model Based on an Interpretable Embedding Dictionary and a Multimodal BCI Agent for 24-Hour Operation",
  "행사": "Events",
  "홈": "Home",
  "환영하는 예수님": "Jesus Welcoming Visitors",
  "황예진": "Hye-jin Hwang",
  "흰색 스튜디오 배경의 AI 연구 서버": "AI research server with a white studio background",
  "뇌과학협동과정": "Interdisciplinary Program in Neuroscience",
  "한국지능시스템학회": "Korean Institute of Intelligent Systems (KIIS)"
};
  var phraseTranslations = {
    '게시판': 'News & Announcements',
    '신호를 측정하고, 지능을 구현하는 장비': 'Equipment for Recording Signals<br>and Building Intelligent Systems',
    '뇌는 수많은 뉴런들로 구성 됩니다': 'The <span class="grad">brain</span> is made up of<br>countless <span class="grad">neurons</span>',
    '뇌파로 뇌의 활동을 측정합니다': 'Recording<br><span class="grad">brain activity</span><br>with EEG',
    'AI가 의도를 예측합니다': '<span class="grad">AI</span> predicts<br>your intentions',
    '생각으로 세상과 소통합니다': 'Interacting with<br>the <span class="grad">world</span><br>through thought',
    '사람에게 도움이 되는 선한 기술을 연구합니다': 'We develop <span class="gradient-text">technology for good</span><br>to help people',
    '살면서 꼭 한번은 들어봐야 할 이야기': 'A Message to Hear<br>at Least Once in Your Life',
    '염홍기 Hong Gi Yeom': 'Hong Gi Yeom',
    '최우성 Woo Sung Choi': 'Woo Sung Choi',
    '김창환 Chang Hwan Kim': 'Chang Hwan Kim',
    '저널 논문 Journal papers': 'Journal Articles',
    '특허 패밀리 Patent families': 'Patent Families',
    '학술 발표 Conference talks': 'Conference Presentations',
    '수상 Awards': 'Awards',
    '원천 신호 추출 Source signal': 'Source Signal Extraction',
    '대역 필터링 Band-pass': 'Bandpass Filtering',
    '기능적 연결성 Connectivity': 'Functional Connectivity',
    '중심성 Centrality': 'Centrality',
    '군집화 Clustering': 'Clustering',
    '시각화 Visualization': 'Visualization',
    '대표 논문 최고 IF 9.8 (Scientific Data) · Scientific Reports “Top 100 in Neuroscience” 선정 · Electronics 표지 논문': 'Research highlights: a paper in <em>Scientific Data</em> (IF 9.8), a <em>Scientific Reports</em> Top 100 in Neuroscience selection, and a cover article in <em>Electronics</em>.',
    '뇌-컴퓨터 인터페이스, 신경 신호 디코딩, 기계학습에 관한 국제·국내 저널 논문과 학회 발표입니다. Scientific Data(IF 9.8), Journal of Neural Engineering, PLOS ONE 등에 게재되었습니다.': 'Our journal articles and conference presentations cover brain–computer interfaces, neural signal decoding, and machine learning. Our work has appeared in journals including <em>Scientific Data</em> (IF 9.8), <em>Journal of Neural Engineering</em>, and <em>PLOS ONE</em>.',
    '미국 오바마 대통령은 2013년 뇌 연구의 중요성을 강조하며 BRAIN Initiative 프로젝트를 제안하고 2014년 예산으로 약 1,100억 원(1억 달러)을 책정했습니다. 미국의 ‘뇌연구 10년(Decade of Brain)’, EU의 ‘유럽 뇌 연구 10년’, G7 국가의 공동 인간 프론티어 과학 프로그램, 그리고 일본 정부의 20년간 약 30조 원(180억 달러) 투자 계획까지 — 세계는 막강한 지원으로 뇌 연구에 뛰어들고 있습니다.': 'In 2013, US President Barack Obama highlighted the importance of brain research and proposed the <b>BRAIN Initiative</b>, allocating approximately KRW 110 billion (USD 100 million) in the 2014 budget. Other major commitments include the US Decade of the Brain, the European Decade of Brain Research, the G7’s joint Human Frontier Science Program, and Japan’s planned investment of approximately KRW 30 trillion (USD 18 billion) over 20 years. These initiatives reflect substantial international support for brain research.',
    'MIT Technology Review의 “10대 유망기술”, 2014 다보스포럼의 “세계를 바꿀 10대 기술”, The New York Times의 “21세기 8대 신기술”, CNN Business 2.0의 “세계를 바꿀 차세대 5대 기술”, 그리고 한국과학기술기획평가원(KISTEP)·삼성경제연구소의 “10대 국가유망미래기술” — BCI는 이 모든 목록에 이름을 올렸습니다.': 'BCI has appeared in numerous lists of promising technologies: MIT <em>Technology Review</em>’s ten promising technologies; ten technologies set to change the world at the 2014 Davos Forum; <em>The New York Times</em>’ eight new technologies for the 21st century; CNN Business 2.0’s five next-generation technologies set to change the world; and ten promising future technologies identified by the Korea Institute of S&amp;T Evaluation and Planning (KISTEP) and the Samsung Economic Research Institute.'
  };
  var phraseLookup = {};
  Object.keys(phraseTranslations).forEach(function (key) {
    phraseLookup[key.replace(/\s+/g, '')] = phraseTranslations[key];
  });
  var phraseOriginals = new WeakMap();
  var phraseSelector = 'h1,h2,h3,p,.stat__lb,.pstep__lb,.person__name';
  function applyPhrase(element) {
    if (!element.matches(phraseSelector) || (element.parentElement && element.parentElement.closest('[data-i18n-phrase]'))) return;
    var saved = phraseOriginals.get(element);
    if (!saved) {
      var english = phraseLookup[element.textContent.replace(/\s+/g, '')];
      if (!english) return;
      saved = { original: element.innerHTML, english: english, language: 'ko' };
      phraseOriginals.set(element, saved);
      element.setAttribute('data-i18n-phrase', '');
    }
    if (saved.language === language) return;
    saved.language = language;
    element.innerHTML = language === 'en' ? saved.english : saved.original;
  }
  var textOriginals = new WeakMap();
  var attrOriginals = new WeakMap();
  var observedAttributes = ['title', 'alt', 'aria-label', 'placeholder', 'content'];
  var LANGUAGE_KEY = 'brainlab-language-v2';
  var language = 'en';
  var applying = false;

  try { language = localStorage.getItem(LANGUAGE_KEY) === 'ko' ? 'ko' : 'en'; } catch (error) {}

  function isExcluded(node) {
    var element = node.nodeType === 1 ? node : node.parentElement;
    return !element || !!element.closest('.lang-switch,script,style,noscript,[data-i18n-phrase]');
  }

  function translatedText(original) {
    var core = original.trim();
    if (!core || !translations[core]) return original;
    return original.slice(0, original.indexOf(core)) + translations[core] + original.slice(original.indexOf(core) + core.length);
  }

  function applyText(node) {
    if (isExcluded(node)) return;
    if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue);
    var original = textOriginals.get(node);
    node.nodeValue = language === 'en' ? translatedText(original) : original;
  }

  function applyAttributes(element) {
    if (isExcluded(element)) return;
    var originals = attrOriginals.get(element);
    if (!originals) { originals = {}; attrOriginals.set(element, originals); }
    observedAttributes.forEach(function (name) {
      if (!element.hasAttribute(name)) return;
      if (!(name in originals)) originals[name] = element.getAttribute(name);
      var original = originals[name];
      element.setAttribute(name, language === 'en' ? translatedText(original) : original);
    });
  }

  function applyTree(root) {
    applying = true;
    if (root.nodeType === 3) applyText(root);
    if (root.nodeType === 1) {
      applyPhrase(root);
      root.querySelectorAll(phraseSelector).forEach(applyPhrase);
      applyAttributes(root);
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) applyText(walker.currentNode);
      root.querySelectorAll('*').forEach(applyAttributes);
    }
    applying = false;
  }

  function updateButtons() {
    document.querySelectorAll('[data-language]').forEach(function (button) {
      var active = button.getAttribute('data-language') === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'ko';
    try { localStorage.setItem(LANGUAGE_KEY, language); } catch (error) {}
    document.documentElement.lang = language;
    applyTree(document.documentElement);
    updateButtons();
    window.dispatchEvent(new CustomEvent('brainlab:languagechange', { detail: { language: language } }));
  }

  function createSwitch() {
    var tools = document.querySelector('.header-tools');
    if (!tools || tools.querySelector('.lang-switch')) return;
    var group = document.createElement('div');
    group.className = 'lang-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', language === 'en' ? 'Language selection' : '언어 선택');
    group.innerHTML = '<button type="button" data-language="ko" aria-label="Korean">KR</button><span aria-hidden="true">/</span><button type="button" data-language="en" aria-label="English">EN</button>';
    group.addEventListener('click', function (event) {
      var button = event.target.closest('[data-language]');
      if (button) setLanguage(button.getAttribute('data-language'));
    });
    tools.insertBefore(group, tools.firstChild);
  }

  var observer = new MutationObserver(function (mutations) {
    if (applying) return;
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(applyTree);
    });
  });

  createSwitch();
  setLanguage(language);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
