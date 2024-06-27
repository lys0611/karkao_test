// src/pages/MainPage.tsx
import React, { useState } from 'react';
import InputBox from '../components/InputBox';
import ApiButton from '../components/ApiButton';
import ScriptDisplay from '../components/ScriptDisplay';
import CopyButton from '../components/CopyButton';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
    max-width: 800px;
    margin: 2em auto;
    padding: 2em;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow: auto;
    max-height: 90vh; // 스크롤 가능한 구역 크기 조절
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 1.5em;
    color: #fff;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2em;
    align-items: flex-start; // 버튼과 인풋 박스 정렬
    position: relative; // 버튼 위치 조정을 위해 설정
`;

const MainPage: React.FC = () => {
    const [accessKey, setAccessKey] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [email, setEmail] = useState('');
    const [projectName, setProjectName] = useState('');
    const [clusterList, setClusterList] = useState('');
    const [clusterName, setClusterName] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [authData, setAuthData] = useState('');
    const [primaryEndpoint, setPrimaryEndpoint] = useState('');
    const [standbyEndpoint, setStandbyEndpoint] = useState('');
    const [dockerImageName, setDockerImageName] = useState('demo-spring-boot');
    const [dockerJavaVersion, setDockerJavaVersion] = useState('17-jdk-slim');
    const [script, setScript] = useState('');

    const generateScript = () => {
        const newScript = `#!/bin/bash
echo "kakaocloud: 1.Starting environment variable setup"
# 환경 변수 설정: 사용자는 이 부분에 자신의 환경에 맞는 값을 입력해야 합니다.
command=$(cat <<EOF
export ACC_KEY='${accessKey}'
export SEC_KEY='${secretKey}'
export EMAIL_ADDRESS='${email}'
export CLUSTER_NAME='${clusterName}'
export API_SERVER='${apiEndpoint}'
export AUTH_DATA='${authData}'
export PROJECT_NAME='${projectName}'
export INPUT_DB_EP1='${primaryEndpoint}'
export INPUT_DB_EP2='${standbyEndpoint}'
export DOCKER_IMAGE_NAME='${dockerImageName}'
export DOCKER_JAVA_VERSION='${dockerJavaVersion}'
export JAVA_VERSION='17'
export SPRING_BOOT_VERSION='3.1.0'
export DB_EP1=\$(echo -n "\$INPUT_DB_EP1" | base64 -w 0)
export DB_EP2=\$(echo -n "\$INPUT_DB_EP2" | base64 -w 0)
EOF
)
eval "$command"
echo "$command" >> /home/ubuntu/.bashrc
echo "kakaocloud: Environment variable setup completed"
echo "kakaocloud: 2.Checking the validity of the script download site"
curl --output /dev/null --silent --head --fail "https://github.com/kakaocloud-edu/tutorial/raw/main/AdvancedCourse/src/script/script.sh" || { echo "kakaocloud: Script download site is not valid"; exit 1; }
echo "kakaocloud: Script download site is valid"
wget https://github.com/kakaocloud-edu/tutorial/raw/main/AdvancedCourse/src/script/script.sh
chmod +x script.sh
sudo -E ./script.sh`;
        setScript(newScript);
    };

    return (
        <Container>
            <Title>Bastion VM 스크립트 생성</Title>
            <InputBox label="사용자 액세스 키" placeholder="직접 입력" value={accessKey} onChange={(e) => setAccessKey(e.target.value)} />
            <InputBox label="사용자 액세스 보안 키" placeholder="직접 입력" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
            <InputBox label="사용자 이메일" placeholder="직접 입력" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputBox label="프로젝트 이름" placeholder="직접 입력" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            <InputBox label="클러스터 리스트" placeholder="직접 입력" value={clusterList} onChange={(e) => setClusterList(e.target.value)} height="100px" />
            <InputBox label="클러스터 이름" placeholder="직접 입력" value={clusterName} onChange={(e) => setClusterName(e.target.value)} />
            <InputBox label="클러스터의 API 엔드포인트" placeholder="직접 입력" value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} />
            <InputBox label="클러스터의 certificate-authority-data" placeholder="직접 입력" value={authData} onChange={(e) => setAuthData(e.target.value)} />
            <InputBox label="Docker Image 이름" placeholder="직접 입력" value={dockerImageName} onChange={(e) => setDockerImageName(e.target.value)} />
            <InputBox label="Docker Image Base Java Version" placeholder="직접 입력" value={dockerJavaVersion} onChange={(e) => setDockerJavaVersion(e.target.value)} />
            <button onClick={generateScript}>스크립트 생성</button>
            <ScriptDisplay script={script} />
            <CopyButton script={script} />
        </Container>
    );
};

export default MainPage;
