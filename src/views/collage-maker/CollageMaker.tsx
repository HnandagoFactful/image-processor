/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */


import { Box, Button, Card, DropdownMenu, Flex, Heading, IconButton, Section, Text, VisuallyHidden } from "@radix-ui/themes";
import { UploadIcon, TrashIcon,  ImageIcon } from '@radix-ui/react-icons'
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import html2canvas from 'html2canvas'
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import ColorPicker, { Color } from 'react-pick-color';

import 'react-resizable/css/styles.css'
import clsx from "clsx";

export default function CollageMaker() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [color, setColor] = useState<Color | undefined>('#fff');
    const [freezeMovable, setFreezeMovable] = useState<boolean>(false);
    const [
        {
            height,
            width
        },
        setHeightWidth
    ] = useState<{
        height: number;
        width: number;
    }>({
        height: window.innerHeight * 0.6,
        width: window.innerWidth * 0.95
    })

    const onResize = function (event: React.SyntheticEvent, { size }: ResizeCallbackData) {
        setHeightWidth({ height: size.height, width: size.width })
    }

    useEffect(function () {
        if (freezeMovable && containerRef.current && color && files.length > 0) {
            html2canvas(containerRef.current, {
                backgroundColor: color.toString()
            }).then(function (canvas: HTMLCanvasElement) {
                document.getElementById('preview-canvas')?.appendChild(canvas)
            });
        }
    }, [
        freezeMovable,
        files
    ])

    return (<Section className="!pt-2 pl-4 pr-4 !pb-0">
        <Heading>Make your own collage</Heading>
        <Flex direction={"column"} gap="4">
            <Box className="relative">
                <Text>Images added: </Text>
                <Card className={clsx("flex flex-col gap-2  min-h-[90px]", {
                    "items-center": files.length === 0
                })}>
                    <Box className="absolute flex flex-col gap-2 right-2 top-2">
                        <Button disabled={files.length === 0} color="lime"
                            onClick={() => {
                                setFreezeMovable(!freezeMovable);
                            }}>{!freezeMovable ? 'Freeze' : 'Unfreeze'} Images</Button>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button variant="soft" color="lime">
                                    Background Color ({color?.toString()})
                                <DropdownMenu.TriggerIcon />
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <ColorPicker color={color} onChange={color => setColor(color.hex)} />
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Box>
                    <VisuallyHidden>
                        <input ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            multiple
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                setFiles([...files, ...(event.target.files ?? [])])
                            }} />
                    </VisuallyHidden>
                    <IconButton color="lime" variant={"outline"} className="w-40" onClick={() => {
                        fileInputRef.current?.click?.()
                    }}>
                        <UploadIcon />
                        <Text className="pl-3">Upload Images</Text>
                    </IconButton>
                    {files.length > 0 && (<Flex direction={"row"} wrap={"wrap"} gap={"2"}>
                        {files.map((item: File, index: number) => {
                            return (
                                <Box key={`${item.name}-${index}`} className="relative border border-1 rounded border-lime-200 p-2">
                                    <IconButton className="absolute -top-4 -right-2 !p-0 h-4 w-4"
                                        variant="surface"
                                        color="lime"
                                        onClick={() => {
                                            setFiles(files.filter((existingFile: File) => item.name !== existingFile.name))
                                        }}>
                                        <TrashIcon height={16} width={16} />
                                    </IconButton>
                                    <Text color="lime">{item.name}</Text>
                                </Box>
                            )
                        })}
                    </Flex>)}
                </Card>
            </Box>
            <Card className="container flex flex-row items-center justify-center mx-auto my-0 !p-0" style={{
                height,
                width
            }}>
                {files.length === 0 ? (<Flex direction={"column"} align={"center"} justify={"center"}>
                    <Heading color="lime" size={"7"}>Add images to create a collage</Heading>
                    <Text as="p" className="text-center" color="lime">Upload limit of 10 images</Text>
                    <Box className="relative w-[300px] h-[220px]">
                        <ImageIcon color="#b3b3b3" height={100} className="absolute top-[52px] -left-[1px]"  width={100} style={{ transform: 'rotate(-45deg) scaleY(1.25)'}} />
                        <ImageIcon color="#b3b3b3" height={100} className="absolute left-20"  width={100} style={{ transform: 'scaleY(1)'}} />
                        <ImageIcon color="#b3b3b3" height={100} className="absolute top-[56px] left-[162px]"  width={100} style={{ transform: 'rotate(45deg) scaleY(1.25)'}} />
                    </Box>
                </Flex>) : 
                (<ResizableBox height={height} width={width} onResize={onResize}
                    resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
                    <Box ref={containerRef} className="relative overflow-hidden h-full w-full">
                        {files.length > 0 ? files.map((selectedFile: File, index: number) => (
                            <div key={`${selectedFile.name}-${index}`} className="target target-2 h-10 w-10 absolute"
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    transform: "scale(1.5, 1)",
                                }}>
                                <img style={{ objectFit: 'fill', height: 'inherit', width: 'inherit' }}
                                    src={URL.createObjectURL(selectedFile)}
                                    alt={selectedFile.name} />
                            </div>
                        )) : null}
                        {!freezeMovable && (<Moveable key={`${files.length}`}
                            target={'.target'}
                            individualGroupable={true}
                            draggable={true}
                            throttleDrag={1}
                            edgeDraggable={false}
                            scalable={true}
                            keepRatio={false}
                            renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                            rotatable={true}
                            snappable={false}
                            throttleRotate={0}
                            rotationPosition={"top"}
                            bounds={{ "left": 0, "top": 0, "right": 500, "bottom": 0, "position": "css" }}
                            onRender={e => {
                                e.target.style.cssText += e.cssText;
                            }}
                        />)}
                    </Box>
                </ResizableBox>)}
            </Card>
            <div id={'preview-canvas'} />
        </Flex>
    </Section>)
}