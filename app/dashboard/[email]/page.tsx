"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  View,
  Button,
  Flex,
  Heading,
  Input,
  Tabs,
  Table,
  TableHead,
  TableRow,
  TableCell,
  SelectField,
} from "@aws-amplify/ui-react";
import styles from "../../page.module.css";
import "@aws-amplify/ui-react/styles.css";

type tableList = { database?: String[] };
type formulaList = { database: String[] };

export default function Page({ params }: { params: { email: string } }) {
  const email = params.email.replace("%40", "@");
  const formula: String[] = [];
  const [modal, setModal] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [columnList, setColumnList] = useState<String[]>([]);
  const [tableList, setTableList] = useState<tableList>();
  const [formulaList, setFormulaList] = useState<formulaList>();

  const addColumn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (columnName === "") {
      return;
    }
    setColumnList([...columnList, columnName]);
    setColumnName("");
  };

  const getTables = useCallback(async () => {
    const response = await fetch(`/api/tables/${email}`);
    const data = await response.json();
    if (data.statusCode === 200 && data.items.tableList) {
      if (data.items.tableList) {
        setTableList(data.items.tableList);
      }
      if (data.items.formula) {
        setFormulaList(data.items.formula);
      }
      setModal(false);
      return;
    }
    setModal(true);
  }, [email]);

  const pushTable = async () => {
    const response = await fetch("/api/tables", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        tableList: { database: [...columnList] },
      }),
    });
    const data = await response.json();
    if (data.statusCode === 200) {
      getTables();
    }
  };

  const postFormula = async () => {
    const response = await fetch("/api/formula", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        formula: { database: formula },
      }),
    });
    const data = await response.json();
    if (data.statusCode === 200) {
      getTables();
    }
  };

  useEffect(() => {
    getTables();
  }, [getTables]);

  return (
    <>
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
        <View as="section" height="40rem" width="80rem">
          {tableList && (
            <Tabs.Container defaultValue="database">
              <Tabs.List justifyContent="flex-start">
                <Tabs.Item value="database">Database</Tabs.Item>
              </Tabs.List>
              <Tabs.Panel value="database">
                <Table>
                  <TableHead>
                    <TableRow>
                      {tableList.database?.map((column, index, row) => (
                        <TableCell as="th" key={index}>
                          <Flex justifyContent="space-around">
                            {column}
                            {!formulaList && index !== row.length - 1 && (
                              <SelectField
                                placeholder="Select formula"
                                label=""
                                labelHidden
                                style={{
                                  textAlign: "center",
                                }}
                                onChange={(e) =>
                                  (formula[index] = e.target.value)
                                }
                              >
                                <option value="+">+</option>
                                <option value="-">-</option>
                                <option value="/">/</option>
                                <option value="*">X</option>
                                <option value="=">=</option>
                              </SelectField>
                            )}
                            {formulaList && (
                              <View>{formulaList.database[index]}</View>
                            )}
                          </Flex>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                </Table>
                <View style={{ textAlign: "right", marginTop: "10px" }}>
                  {!formulaList && (
                    <Button onClick={postFormula}>Save a set formula</Button>
                  )}
                  {formulaList && <Button>Add Data</Button>}
                </View>
              </Tabs.Panel>
            </Tabs.Container>
          )}
        </View>
      </main>
      {modal && (
        <Flex
          justifyContent="center"
          alignItems="center"
          className={styles.modalWrapper}
        >
          <View className={styles.modal}>
            <Heading style={{ marginBottom: "10px" }} level={4}>
              Add Columns
            </Heading>
            <Flex>
              <Input
                placeholder="Please enter a column name."
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
              />
              <Button onClick={addColumn}>+</Button>
            </Flex>
            <ol className="columnList">
              {columnList.map((column, index) => (
                <li key={index} style={{ marginTop: "10px" }}>
                  <Heading level={5}>{column}</Heading>
                </li>
              ))}
            </ol>
            <Button style={{ marginTop: "10px" }} onClick={pushTable}>
              Create Database
            </Button>
          </View>
        </Flex>
      )}
    </>
  );
}
