"use client";

import { useSession } from "next-auth/react";
import React, { useLayoutEffect, useState } from "react";
import Loader from "@/app/loading";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { requestInitType } from "@/app/api/auth/transactions/route";
import { toast } from "react-toastify";
import createRequest from "@/services/request-service";

declare global {
  var ws: WebSocket | undefined;
}

export default function AuthLoader({
  children,
  goto,
  verb,
}: {
  children?: React.ReactNode;
  goto: string;
  verb: "authenticated" | "unauthenticated";
}) {
  const { status, data } = useSession();
  const router = useRouter();
  const [authorising, setAuthorising] = useState(false);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [request, setRequest] = useState<requestInitType>({
    accountNumber: "",
    amount: 0,
    bankName: "",
    bankSlug: "",
    username: "",
    accountId: 0,
  });

  async function handleAuthorise({ authorise }: { authorise: boolean }) {
    setAuthorising(true);

    const res = await createRequest(request, authorise).finally(() =>
      setAuthorising(false)
    );

    onClose();

    if (!authorise) {
      return toast.info("Transaction request cancelled");
    }

    toast(res.message, { type: res.success ? "success" : "error" });
  }

  useLayoutEffect(() => {
    const ws: WebSocket = global.ws ?? new WebSocket("ws://localhost:3001");

    if (!global.ws) global.ws = ws;

    ws.onmessage = (message) => {
      const _data = JSON.parse(message.data);
      const isMine = _data.username === data?.user?.email;

      if (isMine) {
        setRequest(_data);

        onOpen();
      }
    };

    return () => {
      ws.close();
    };
  }, [data]);

  return status === "loading" ? (
    <Loader />
  ) : status === verb ? (
    router.replace(goto)
  ) : (
    <>
      {children}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm transaction
              </ModalHeader>
              <ModalBody>
                <p>
                  Authorised the transaction of amount{" "}
                  <strong>
                    {Intl.NumberFormat("en-GB", {
                      minimumFractionDigits: 2,
                    }).format(request.amount)}
                  </strong>{" "}
                  on account '{request.accountNumber}' at the {request.bankName}
                  .
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => handleAuthorise({ authorise: false })}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={authorising}
                  disabled={authorising}
                  color="warning"
                  onPress={() => handleAuthorise({ authorise: true })}
                >
                  Authorise
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
