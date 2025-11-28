import { useState } from "react";
import { Bell, Plus, X } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { Notification } from "@/contexts/ProcessesContext";

interface NotificationsProps {
    notifications: Notification[]
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
    process: string | undefined
}

export function Notifications({ notifications, setNotifications, process }: NotificationsProps) {
    const notificationTypes = [
        'Email',
        'Carta com AR',
        'WhatsApp',
    ];

    return (
        <>

            {/* Notificações Enviadas */}
            <div className="space-y-4">
                <h3 className="text-[#a16535] flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificações Enviadas
                </h3>

                {/* Lista de Notificações */}
                <div className="space-y-3">
                    {notifications.map((notification, idx) => (
                        <div key={idx} className="bg-[#f6f3ee] border border-[#d4c4b0] rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-[#a16535] text-white">{notification.type}</Badge>
                                </div>
                                {!notification.id &&
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setNotifications(prev =>
                                                prev.filter((_, i) => i !== idx)
                                            );
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                }
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2">
                                <div className="space-y-1">
                                    <Label className="text-[#6b5544] text-xs">Data de Envio</Label>
                                    <Input
                                        type="datetime-local"
                                        value={notification.sentAt || ""}
                                        onChange={(e) => {
                                            setNotifications(prev =>
                                                prev.map((n, i) =>
                                                    i === idx ? { ...n, sentAt: e.target.value } : n
                                                )
                                            );
                                        }}
                                        className="bg-white border-[#d4c4b0] text-[#2d1f16] h-9"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[#6b5544] text-xs">Data de Recebimento</Label>
                                    <Input
                                        type="datetime-local"
                                        value={notification.receivedAt || ""}
                                        onChange={(e) => {
                                            setNotifications(prev =>
                                                prev.map((n, i) =>
                                                    i === idx ? { ...n, receivedAt: e.target.value } : n
                                                )
                                            );
                                        }}
                                        className="bg-white border-[#d4c4b0] text-[#2d1f16] h-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="observacoes" className="text-[#6b5544] text-xs">
                                    Observações
                                </Label>
                                <Textarea
                                    id="observacoes"
                                    placeholder="Observações sobre a notificação enviada..."
                                    value={notification.notes || ""}
                                    onChange={(e) => {
                                        setNotifications((prev: Notification[]) =>
                                            prev.map((n, i) =>
                                                i === idx ? { ...n, notes: e.target.value } : n
                                            )
                                        );
                                    }}
                                    rows={2}
                                    className="bg-[#f6f3ee] border-[#d4c4b0] text-[#2d1f16] placeholder:text-[#6b5544] focus:border-[#a16535] focus:ring-[#a16535]/20 resize-none"
                                />
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <div className="text-center text-[#6b5544] py-4 bg-[#f6f3ee] border border-dashed border-[#d4c4b0] rounded-lg">
                            Nenhuma notificação cadastrada
                        </div>
                    )}
                </div>

                {/* Botões para adicionar notificações */}
                <div className="flex flex-wrap gap-2">
                    {notificationTypes.map((type) => (
                        <Button
                            key={type}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setNotifications((prev: Notification[]) => [...prev, {
                                    id: null,
                                    process: process,
                                    type,
                                    sentAt: '',
                                    receivedAt: '',
                                    notes: ''
                                }]);
                            }}
                            className="border-[#a16535] text-[#a16535] hover:bg-[#a16535] hover:text-white"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            {type}
                        </Button>
                    ))}
                </div>
            </div>
        </>
    )
}