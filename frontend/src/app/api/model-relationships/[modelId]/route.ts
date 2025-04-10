import { NextResponse } from 'next/server'

// Mock data map for different model IDs
const mockDataMap: { [key: string]: any } = {
	'99009': {
		success: true,
		message: 'Request was successful',
		data: [
			{
				id: 5,
				qmModel: {
					qmModelId: 99009,
					qmType: null,
					qmPurpose: null,
					qmTypeId: null,
					qmPurposeId: null,
					qmName: 'Complex Regulatory Market Data Publications',
					owner: null,
					accountableExec: null,
					modelUses: [],
					createdAt: '2025-04-09T09:49:22.133067',
					updatedAt: null
				},
				qmInputToModel: {
					qmModelId: 99007,
					qmType: null,
					qmPurpose: null,
					qmTypeId: null,
					qmPurposeId: null,
					qmName: 'Determinstic',
					owner: null,
					accountableExec: null,
					modelUses: [],
					createdAt: '2025-04-09T09:49:22.133067',
					updatedAt: null
				},
				qmModelId: null,
				qmInputTo: null,
				createdAt: '2025-04-09T09:49:22.133067',
				updatedAt: null,
				inputToModels: [
					{
						id: null,
						qmModel: {
							qmModelId: 99007,
							qmType: null,
							qmPurpose: null,
							qmTypeId: null,
							qmPurposeId: null,
							qmName: 'Determinstic',
							owner: null,
							accountableExec: null,
							modelUses: [],
							createdAt: '2025-04-09T09:49:22.133067',
							updatedAt: null
						},
						qmInputToModel: null,
						qmModelId: 99007,
						qmInputTo: null,
						createdAt: '2025-04-09T09:49:22.133067',
						updatedAt: null,
						inputToModels: [
							{
								id: null,
								qmModel: {
									qmModelId: 99001,
									qmType: null,
									qmPurpose: null,
									qmTypeId: null,
									qmPurposeId: null,
									qmName: 'C&FVA',
									owner: null,
									accountableExec: null,
									modelUses: [],
									createdAt: '2025-04-09T09:49:22.133067',
									updatedAt: null
								},
								qmInputToModel: null,
								qmModelId: 99001,
								qmInputTo: null,
								createdAt: '2025-04-09T09:49:22.133067',
								updatedAt: null,
								inputToModels: [
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									}
								]
							}
						]
					},
					{
						id: null,
						qmModel: {
							qmModelId: 99006,
							qmType: null,
							qmPurpose: null,
							qmTypeId: null,
							qmPurposeId: null,
							qmName: 'Mi Smile',
							owner: null,
							accountableExec: null,
							modelUses: [],
							createdAt: '2025-04-09T09:49:22.133067',
							updatedAt: null
						},
						qmInputToModel: null,
						qmModelId: 99006,
						qmInputTo: null,
						createdAt: '2025-04-09T09:49:22.133067',
						updatedAt: null,
						inputToModels: [
							{
								id: null,
								qmModel: {
									qmModelId: 99001,
									qmType: null,
									qmPurpose: null,
									qmTypeId: null,
									qmPurposeId: null,
									qmName: 'C&FVA',
									owner: null,
									accountableExec: null,
									modelUses: [],
									createdAt: '2025-04-09T09:49:22.133067',
									updatedAt: null
								},
								qmInputToModel: null,
								qmModelId: 99001,
								qmInputTo: null,
								createdAt: '2025-04-09T09:49:22.133067',
								updatedAt: null,
								inputToModels: [
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									}
								]
							}
						]
					},
					{
						id: null,
						qmModel: {
							qmModelId: 99005,
							qmType: null,
							qmPurpose: null,
							qmTypeId: null,
							qmPurposeId: null,
							qmName: 'LTFX:BS:Analytic',
							owner: null,
							accountableExec: null,
							modelUses: [],
							createdAt: '2025-04-09T09:49:22.133067',
							updatedAt: null
						},
						qmInputToModel: null,
						qmModelId: 99005,
						qmInputTo: null,
						createdAt: '2025-04-09T09:49:22.133067',
						updatedAt: null,
						inputToModels: [
							{
								id: null,
								qmModel: {
									qmModelId: 99001,
									qmType: null,
									qmPurpose: null,
									qmTypeId: null,
									qmPurposeId: null,
									qmName: 'C&FVA',
									owner: null,
									accountableExec: null,
									modelUses: [],
									createdAt: '2025-04-09T09:49:22.133067',
									updatedAt: null
								},
								qmInputToModel: null,
								qmModelId: 99001,
								qmInputTo: null,
								createdAt: '2025-04-09T09:49:22.133067',
								updatedAt: null,
								inputToModels: [
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									}
								]
							}
						]
					},
					{
						id: null,
						qmModel: {
							qmModelId: 99004,
							qmType: null,
							qmPurpose: null,
							qmTypeId: null,
							qmPurposeId: null,
							qmName: 'LGIX2F',
							owner: null,
							accountableExec: null,
							modelUses: [],
							createdAt: '2025-04-09T09:49:22.133067',
							updatedAt: null
						},
						qmInputToModel: null,
						qmModelId: 99004,
						qmInputTo: null,
						createdAt: '2025-04-09T09:49:22.133067',
						updatedAt: null,
						inputToModels: [
							{
								id: null,
								qmModel: {
									qmModelId: 99001,
									qmType: null,
									qmPurpose: null,
									qmTypeId: null,
									qmPurposeId: null,
									qmName: 'C&FVA',
									owner: null,
									accountableExec: null,
									modelUses: [],
									createdAt: '2025-04-09T09:49:22.133067',
									updatedAt: null
								},
								qmInputToModel: null,
								qmModelId: 99001,
								qmInputTo: null,
								createdAt: '2025-04-09T09:49:22.133067',
								updatedAt: null,
								inputToModels: [
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 191,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'CVA Stress Testing',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 191,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									},
									{
										id: null,
										qmModel: {
											qmModelId: 1024,
											qmType: null,
											qmPurpose: null,
											qmTypeId: null,
											qmPurposeId: null,
											qmName: 'FRTB-CVA SA/BY Hybrid',
											owner: null,
											accountableExec: null,
											modelUses: [],
											createdAt: '2025-04-09T09:49:22.133067',
											updatedAt: null
										},
										qmInputToModel: null,
										qmModelId: 1024,
										qmInputTo: null,
										createdAt: '2025-04-09T09:49:22.133067',
										updatedAt: null,
										inputToModels: []
									}
								]
							}
						]
					}
				]
			}
		]
	}
	// Add more mock data for other model IDs as needed
}

export async function GET(request: Request, { params }: { params: { modelId: string } }) {
	try {
		const modelId = params.modelId
		const mockData = mockDataMap[modelId]

		if (!mockData) {
			return NextResponse.json({ success: false, message: 'Model not found' }, { status: 404 })
		}

		return NextResponse.json(mockData)
	} catch (error) {
		console.error('Error fetching model relationships:', error)
		return NextResponse.json({ success: false, message: 'Failed to fetch model relationships' }, { status: 500 })
	}
}
