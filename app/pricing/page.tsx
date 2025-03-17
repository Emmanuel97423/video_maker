"use client"

import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Clock, Video, Check, Minus } from "lucide-react"

interface Feature {
    category: string;
    items: {
        name?: string;
        starter?: string | boolean;
        professional?: string | boolean;
        business?: string | boolean;
    }[];
}

interface Plan {
    name?: string;
    description?: string;
    price: number;
    save: number;
    popular: boolean;
    features: string[];
    includedFeatures: string[];
    addOn?: {
        name: string;
        price: number;
        description: string;
    };
}

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(true)

    const features: Feature[] = [
        {
            category: "Génération de vidéos",
            items: [
                {
                    name: "AI Auto Génération",
                    starter: "15 vidéos / month",
                    // professional: "40 videos / month",
                    // business: "Unlimited"
                },
                {
                    name: "Durée/Vidéo",
                    starter: "5 secondes",
                    // professional: "5 minutes",
                    // business: "30 minutes"
                },
                // {
                //     name: "Caption Templates",
                //     starter: "Standard",
                //     professional: "Premium",
                //     business: "Premium"
                // },
                // {
                //     name: "B-Roll",
                //     starter: "Standard",
                //     professional: "Premium + Movie clips",
                //     business: "Premium + Movie clips"
                // }
            ]
        },
        {
            category: "Export & Qualité",
            items: [
                {
                    name: "Qualité",
                    starter: "720p",
                    // professional: "1080p, 2K",
                    // business: "1080p, 4K"
                },
                {
                    name: "FPS",
                    starter: "30 FPS",
                    // professional: "30 FPS",
                    // business: "30 FPS, 60 FPS"
                },
                {
                    name: "Filligrane",
                    starter: "Non",
                    // professional: "No watermark",
                    // business: "No watermark"
                }
            ]
        },
        // {
        //     category: "Customization",
        //     items: [
        //         {
        //             name: "Custom Templates",
        //             starter: false,
        //             // professional: "3 templates",
        //             // business: "Unlimited"
        //         },
        //         {
        //             name: "Custom Fonts",
        //             starter: false,
        //             // professional: true,
        //             // business: true
        //         },
        //         {
        //             name: "Logos & Brand Assets",
        //             starter: false,
        //             // professional: false,
        //             // business: true
        //         },
        //         {
        //             name: "Custom vocabulary",
        //             starter: false,
        //             // professional: false,
        //             // business: true
        //         }
        //     ]
        // },
        // {
        //     category: "Users & Workspace",
        //     items: [
        //         {
        //             name: "Users/Workspace",
        //             starter: "1 user",
        //             // professional: "3 users",
        //             // business: "15 users"
        //         }
        //     ]
        // },
        // {
        //     category: "AI-Powered Tools",
        //     items: [
        //         {
        //             name: "AI Hook title",
        //             starter: false,
        //             // professional: true,
        //             // business: true
        //         },
        //         {
        //             name: "AI Remove silences",
        //             starter: false,
        //             // professional: true,
        //             // business: true
        //         },
        //         {
        //             name: "AI Remove bad takes",
        //             starter: false,
        //             // professional: true,
        //             // business: true
        //         },
        //         {
        //             name: "AI Filler words",
        //             starter: false,
        //             // professional: true,
        //             // business: true
        //         },
        //         {
        //             name: "AI Clean audio",
        //             starter: false,
        //             // professional: true,
        //             // business: true
        //         },
        //         {
        //             name: "AI Description",
        //             starter: true,
        //             // professional: true,
        //             // business: true
        //         },
        //         {
        //             name: "Magic B-rolls",
        //             starter: true,
        //             // professional: true,
        //             // business: true
        //         }
        //     ]
        // },
        // {
        //     category: "Support",
        //     items: [
        //         {
        //             name: "Priority Support",
        //             starter: false,
        //             // professional: false,
        //             // business: true
        //         }
        //     ]
        // }
    ]

    const plans: Plan[] = [
        {
            name: "Starter",
            description: "Pour les individus qui débutent avec la création vidéo",
            price: isAnnual ? 12 : 16,
            save: 84,
            popular: true,
            features: [
                "Jusqu'à 15 vidéos / mois",
                "Max 5 secondes / vidéo",
            ],
            includedFeatures: [
                "Pas de filigrane",
                "Vidéo téléchargeable",
                "Export en 720p & 30 FPS"
            ]
        },
        // {
        //     name: "Professional",
        //     description: "Pour les pros qui créent des shorts impactants avec l'IA",
        //     price: isAnnual ? 23 : 31,
        //     save: 192,
        //     popular: true,
        //     features: [
        //         "Jusqu'à 40 vidéos / mois",
        //         "Max 5 minutes / vidéo",
        //     ],
        //     includedFeatures: [
        //         "Sous-titres animés tendance",
        //         "Templates de sous-titres personnalisés",
        //         "B-rolls & Audio Storyblocks",
        //         "Suppression des prises ratées & silences",
        //         "Génération de titres accrocheurs",
        //         "Nettoyage audio qualité studio"
        //     ],
        //     addOn: {
        //         name: "Magic Clips",
        //         price: 12,
        //         description: "Obtenez des clips illimités instantanément à partir de longues vidéos avec l'IA"
        //     }
        // },
        // {
        //     name: "Business",
        //     description: "Pour les équipes qui veulent produire des vidéos facilement",
        //     price: isAnnual ? 41 : 55,
        //     save: 336,
        //     features: [
        //         "Vidéos illimitées / mois",
        //         "Max 30 minutes / vidéo",
        //     ],
        //     includedFeatures: [
        //         "Export en 4k & 60 FPS",
        //         "Templates personnalisés illimités",
        //         "Collaborateurs illimités",
        //         "Logos & éléments de marque",
        //         "Dictionnaire de mots personnalisé",
        //         "Support prioritaire & rendu"
        //     ],
        //     addOn: {
        //         name: "Magic Clips",
        //         price: 12,
        //         description: "Obtenez des clips illimités instantanément à partir de longues vidéos avec l'IA"
        //     }
        // }
    ]

    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Commencez à générer des vidéos à partir de vos photos, aujourd'hui.
                </h1>
                <p className="text-gray-600 mb-8">
                    Essayez avec 3 générations de vidéos gratuites. Pas de carte bancaire requise.
                </p>
                <div className="flex items-center justify-center gap-3 mb-12">
                    <span className="text-sm text-gray-600">41% de réduction annuelle</span>
                    <Switch 
                        checked={isAnnual}
                        onCheckedChange={setIsAnnual}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex items-center justify-center flex-col lg:flex-row gap-8">
                {plans.map((plan) => (
                    <div key={plan.name} className={`max-w-96 rounded-2xl border flex-1 ${plan.popular ? 'border-orange-500 relative' : 'border-gray-200'} p-8`}>
                        {plan.popular && (
                            <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                    <span>🔥</span> PLAN LE PLUS POPULAIRE
                                </span>
                            </div>
                        )}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">{plan.name}</h2>
                            <p className="text-gray-600 mt-2">{plan.description}</p>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">{plan.price}€</span>
                                <span className="text-gray-600 ml-2">/ mois</span>
                            </div>
                            <p className="text-sm text-gray-600">facturé {isAnnual ? 'annuellement' : 'mensuellement'}</p>
                            {isAnnual && (
                                <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    économisez {plan.save}€
                                </span>
                            )}
                        </div>

                        <button className={`w-full py-2 px-4 rounded-lg mb-6 font-medium ${
                            plan.popular 
                                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                                : 'border border-gray-300 hover:border-gray-400'
                        }`}>
                            Sélectionner
                        </button>

                        <div className="space-y-4 mb-8">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    {feature.includes("vidéos") ? <Video className="h-5 w-5 text-gray-400" /> : <Clock className="h-5 w-5 text-gray-400" />}
                                    <span className="text-gray-600">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-6">
                            <p className="font-medium mb-4">Inclus dans {plan.name} :</p>
                            <ul className="space-y-3">
                                {plan.includedFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                                        <span className="text-gray-600 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {plan.addOn && (
                            <div className="mt-6 border-t pt-6">
                                <p className="text-sm font-medium mb-4">Add-on</p>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">{plan.addOn.name}</span>
                                        <span className="text-sm text-gray-600">+{plan.addOn.price}€ / mois</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{plan.addOn.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-16 max-w-7xl mx-auto">

                {features.map((section, idx) => (
                    
                    <div key={section.category} className={idx !== 0 ? "mt-8" : ""}>
                        <h3 className="text-lg font-semibold mb-4">{section.category}</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 w-1/3">Fonctionnalités</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Starter</th>
                                        {/* <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Professional</th>
                                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Business</th> */}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {section.items.map((item) => (
                                        <tr key={item.name} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-900">{item.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {typeof item.starter === 'boolean' ? (
                                                    item.starter ? <Check className="h-5 w-5 text-green-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                                                ) : item.starter}
                                            </td>
                                            {/* <td className="py-3 px-4 text-sm text-gray-600">
                                                {typeof item.professional === 'boolean' ? (
                                                    item.professional ? <Check className="h-5 w-5 text-green-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                                                ) : item.professional}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {typeof item.business === 'boolean' ? (
                                                    item.business ? <Check className="h-5 w-5 text-green-500" /> : <Minus className="h-5 w-5 text-gray-300" />
                                                ) : item.business}
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
                    <div className="bg-white border rounded-lg mt-8">
                    <div className="py-4 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-3 gap-8">
                            <div className="flex flex-col items-start">
                                <span className="font-medium mb-1">Starter</span>
                                <span className="text-sm text-gray-600 mb-2">{isAnnual ? "12€" : "16€"}/mois, facturé annuellement</span>
                                <button className="py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 hover:border-gray-400">
                                    Choisir
                                </button>
                            </div>
                            {/* <div className="flex flex-col items-start opacity-50">
                                <span className="font-medium mb-1">Professional</span>
                                <span className="text-sm text-gray-600 mb-2">{isAnnual ? "23€" : "31€"}/mois, facturé annuellement</span>
                                <button className="py-2 px-4 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white">
                                    Start Now
                                </button>
                            </div>
                            <div className="flex flex-col items-start opacity-50">
                                <span className="font-medium mb-1">Business</span>
                                <span className="text-sm text-gray-600 mb-2">{isAnnual ? "41€" : "55€"}/mois, facturé annuellement</span>
                                <button className="py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 hover:border-gray-400">
                                    Start Now
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
} 