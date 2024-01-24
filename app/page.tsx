"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flex, Heading, Input, Button } from "@aws-amplify/ui-react";
import styles from "./page.module.css";
import "@aws-amplify/ui-react/styles.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const postEmail = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await response.json();
    if (data.statusCode === 200) {
      router.push("/dashboard");
    }
  };

  const onClick = (e: any) => {
    e.preventDefault();
    if (
      email &&
      email.includes("@") &&
      email[0] !== "@" &&
      email[email.length - 1] !== "@"
    ) {
      setEmail("");
      postEmail();
      return;
    }
    alert("올바른 이메일을 입력해주세요.");
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>CONNECT</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <Flex
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        alignContent="flex-start"
        wrap="nowrap"
        gap="1rem"
      >
        <Heading level={3}>
          이메일을 입력하시면 데모용 계정이 생성됩니다.
        </Heading>
        <Flex as="form" justifyContent="space-around">
          <Input
            type="email"
            placeholder="이메일을 입력해주세요."
            width="75%"
            isRequired
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" loadingText="시작하기" onClick={onClick}>
            시작하기
          </Button>
        </Flex>
      </Flex>

      <div className={styles.grid}></div>
    </main>
  );
}
