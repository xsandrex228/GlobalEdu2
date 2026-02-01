'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, AlertCircle, CheckCircle, Lightbulb, TrendingUp, Target, FileText, ChevronRight, Edit3 } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Textarea } from '@/app/components/ui/textarea'
import { Input } from '@/app/components/ui/input'
import { Progress } from '@/app/components/ui/progress'
import { Badge } from '@/app/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'

type EssayStep = 'prompt' | 'essay' | 'feedback'

interface Suggestion {
  id: string
  originalText: string
  correctedText: string
  type: 'grammar' | 'clarity' | 'structure' | 'impact' | 'tone'
  explanation: string
}

interface StructuralIssue {
  section: string
  issue: string
  suggestion: string
}

const suggestionTypeConfig = {
  grammar: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle },
  clarity: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Lightbulb },
  structure: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: TrendingUp },
  impact: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: Sparkles },
  tone: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: CheckCircle },
}

export function EssayFeedback() {
  const [step, setStep] = useState<EssayStep>('prompt')
  const [essayPrompt, setEssayPrompt] = useState('')
  const [wordLimit, setWordLimit] = useState('')
  const [essay, setEssay] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
 
  // Feedback state
  const [promptType, setPromptType] = useState('')
  const [overallSummary, setOverallSummary] = useState('')
  const [structuralIssues, setStructuralIssues] = useState<StructuralIssue[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [promptAlignment, setPromptAlignment] = useState({ aligned: '', notAligned: '' })
  const [improvementPlan, setImprovementPlan] = useState<string[]>([])
  const [readinessScore, setReadinessScore] = useState(0)
  const [strengths, setStrengths] = useState<string[]>([])
  const [redFlags, setRedFlags] = useState<string[]>([])
  const [rewriteSuggestion, setRewriteSuggestion] = useState('')

  const analyzePrompt = () => {
    if (!essayPrompt.trim()) return
   
    // Simulate prompt analysis
    const mockPromptType = essayPrompt.toLowerCase().includes('why')
      ? 'Motivational Essay - "Why this program?"'
      : essayPrompt.toLowerCase().includes('leadership')
      ? 'Leadership Experience Essay'
      : essayPrompt.toLowerCase().includes('challenge') || essayPrompt.toLowerCase().includes('obstacle')
      ? 'Personal Challenge / Growth Essay'
      : 'Personal Statement'
   
    setPromptType(mockPromptType)
    setStep('essay')
  }

const analyzeEssay = async () => {
  if (!essay.trim()) {
    setError('Вставьте текст эссе')
    return
  }

  setIsAnalyzing(true)
  setError('')
  setFeedback('') // если setFeedback есть — оставь, иначе удали

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: essay
      }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      setError(data.error || 'Ошибка сервера')
    } else {
      setFeedback(data.reply)
      setStep('feedback')
    }
  } catch (err) {
    setError('Не удалось подключиться к ИИ. Проверь интернет или ключ OpenAI')
  } finally {
    setIsAnalyzing(false)
  }
}
      const data = await res.json()

      if (!res.ok || data.error) {
        console.error(data.error || 'Ошибка сервера')
        // Обработка ошибки, если нужно
        setIsAnalyzing(false)
        return
      }

      const response = JSON.parse(data.reply)  // ИИ возвращает JSON, парсим его

      // Устанавливаем state из ответа ИИ
      setOverallSummary(response.overallSummary)
      setStructuralIssues(response.structuralIssues)
      setSuggestions(response.suggestions)
      setPromptAlignment(response.promptAlignment)
      setImprovementPlan(response.improvementPlan)
      setReadinessScore(response.readinessScore)
      setStrengths(response.strengths)
      setRedFlags(response.redFlags)
      setRewriteSuggestion(response.rewriteSuggestion)

      setStep('feedback')
    } catch (err) {
      console.error('Не удалось подключиться к ИИ')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const resetAnalysis = () => {
    setStep('prompt')
    setEssayPrompt('')
    setWordLimit('')
    setEssay('')
    setPromptType('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="size-8 text-blue-600" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
          AI Essay Mentor
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Expert feedback tailored to your specific essay prompt. Get strategic guidance from an admissions perspective.
        </p>
      </motion.div>
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
        <div className={`flex items-center gap-2 ${step === 'prompt' ? 'text-blue-600' : step === 'essay' || step === 'feedback' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'prompt' ? 'bg-blue-100' : step === 'essay' || step === 'feedback' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {step === 'essay' || step === 'feedback' ? <CheckCircle className="size-5" /> : <span className="text-sm font-medium">1</span>}
          </div>
          <span className="text-sm font-medium">Enter Prompt</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300" />
        <div className={`flex items-center gap-2 ${step === 'essay' ? 'text-blue-600' : step === 'feedback' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'essay' ? 'bg-blue-100' : step === 'feedback' ? 'bg-green-100' : 'bg-gray-100'}`}>
            {step === 'feedback' ? <CheckCircle className="size-5" /> : <span className="text-sm font-medium">2</span>}
          </div>
          <span className="text-sm font-medium">Submit Essay</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300" />
        <div className={`flex items-center gap-2 ${step === 'feedback' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'feedback' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <span className="text-sm font-medium">3</span>
          </div>
          <span className="text-sm font-medium">Get Feedback</span>
        </div>
      </div>
      {/* Step 1: Essay Prompt */}
      <AnimatePresence mode="wait">
        {step === 'prompt' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 shadow-md max-w-3xl mx-auto">
              <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Target className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Why provide the prompt first?</h3>
                  <p className="text-xs text-gray-700">
                    Different prompts require different structures and strategies. By understanding your specific question, our AI can evaluate whether your essay actually answers what's being asked.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Essay Prompt / Question <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={essayPrompt}
                    onChange={(e) => setEssayPrompt(e.target.value)}
                    placeholder='e.g., "Why do you want to participate in this program?" or "Describe a challenge you overcame and what you learned."'
                    className="min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Word Limit (optional)
                  </label>
                  <Input
                    type="text"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                    placeholder="e.g., 500 words or 3000 characters"
                  />
                </div>
                <Button
                  onClick={analyzePrompt}
                  disabled={!essayPrompt.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Continue to Essay
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
        {/* Step 2: Essay Input */}
        {step === 'essay' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 shadow-md max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your Essay</h3>
                    <p className="text-sm text-gray-600">Paste your essay below for analysis</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setStep('prompt')}>
                    Change Prompt
                  </Button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Prompt Type Detected:</p>
                  <p className="text-sm font-medium text-gray-900">{promptType}</p>
                  {wordLimit && (
                    <p className="text-xs text-gray-600 mt-2">Word Limit: {wordLimit}</p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <Textarea
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  placeholder="Paste your complete essay here..."
                  className="min-h-[400px] text-sm leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {essay.split(/\s+/).filter(Boolean).length} words • {essay.length} characters
                  </span>
                </div>
              </div>
              <Button
                onClick={analyzeEssay}
                disabled={essay.length < 100 || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="size-5 mr-2" />
                    </motion.div>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 mr-2" />
                    Analyze Essay
                  </>
                )}
              </Button>
              {essay.length < 100 && essay.length > 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Write at least 100 characters for meaningful feedback
                </p>
              )}
            </Card>
          </motion.div>
        )}
        {/* Step 3: Feedback */}
        {step === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header with score */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="p-6 shadow-md lg:col-span-1">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Readiness Score</p>
                    <div className={`text-5xl font-bold ${getScoreColor(readinessScore)}`}>
                      {readinessScore}
                      <span className="text-2xl">/100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={readinessScore} className="h-2" indicatorClassName={getScoreBgColor(readinessScore)} />
                    <p className="text-xs text-gray-500">
                      {readinessScore >= 80 ? 'Strong essay - minor polish needed' :
                       readinessScore >= 60 ? 'Good foundation - strategic improvements needed' :
                       'Needs significant revision'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetAnalysis} className="w-full">
                    Analyze New Essay
                  </Button>
                </div>
              </Card>
              <div className="lg:col-span-3 space-y-6">
                {/* Overall Summary */}
                <Card className="p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{overallSummary}</p>
                </Card>
                {/* Main Tabs */}
                <Card className="p-6 shadow-md">
                  <Tabs defaultValue="structure">
                    <TabsList className="grid w-full grid-cols-5 mb-6">
                      <TabsTrigger value="structure">Structure</TabsTrigger>
                      <TabsTrigger value="language">Language</TabsTrigger>
                      <TabsTrigger value="alignment">Prompt Fit</TabsTrigger>
                      <TabsTrigger value="admissions">Admissions View</TabsTrigger>
                      <TabsTrigger value="action">Action Plan</TabsTrigger>
                    </TabsList>
                    {/* Structure Tab */}
                    <TabsContent value="structure" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">Structural Analysis</h4>
                      {structuralIssues.map((issue, index) => (
                        <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertCircle className="size-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-purple-900">{issue.section}</p>
                              <p className="text-xs text-purple-700 mt-1">Issue: {issue.issue}</p>
                            </div>
                          </div>
                          <div className="mt-3 pl-6 border-l-2 border-purple-300">
                            <p className="text-xs font-medium text-gray-900 mb-1">✓ Suggestion:</p>
                            <p className="text-xs text-gray-700">{issue.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    {/* Language Tab */}
                    <TabsContent value="language" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Inline Corrections & Improvements</h4>
                      <p className="text-xs text-gray-600 mb-4">Click each suggestion to see why the change improves your essay</p>
                      {suggestions.map((suggestion) => {
                        const config = suggestionTypeConfig[suggestion.type]
                        const Icon = config.icon
                       
                        return (
                          <div key={suggestion.id} className={`p-4 rounded-lg border ${config.bg} ${config.border}`}>
                            <div className="flex items-start gap-2 mb-3">
                              <Icon className={`size-4 ${config.color} mt-0.5 flex-shrink-0`} />
                              <Badge variant="secondary" className={`text-xs ${config.color.replace('text-', 'bg-').replace('600', '100')}`}>
                                {suggestion.type}
                              </Badge>
                            </div>
                           
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">Original:</p>
                                <p className="text-sm text-gray-700 line-through">{suggestion.originalText}</p>
                              </div>
                             
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">Improved:</p>
                                <p className="text-sm text-gray-900 font-medium">{suggestion.correctedText}</p>
                              </div>
                             
                              <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium">Why:</span> {suggestion.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </TabsContent>
                    {/* Prompt Alignment Tab */}
                    <TabsContent value="alignment" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">Does Your Essay Answer the Prompt?</h4>
                     
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                          <h5 className="text-sm font-semibold text-green-900">What You're Doing Right</h5>
                        </div>
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans mt-2">
                          {promptAlignment.aligned}
                        </pre>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle className="size-5 text-red-600 flex-shrink-0" />
                          <h5 className="text-sm font-semibold text-red-900">Missing from Your Response</h5>
                        </div>
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans mt-2">
                          {promptAlignment.notAligned}
                        </pre>
                      </div>
                    </TabsContent>
                    {/* Admissions Perspective Tab */}
                    <TabsContent value="admissions" className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Strengths (Admissions Committee View)</h4>
                        <ul className="space-y-2">
                          {strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Red Flags / Weaknesses</h4>
                        <ul className="space-y-2">
                          {redFlags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <AlertCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Competitive Analysis</h4>
                        <p className="text-sm text-gray-700">
                          In a global applicant pool, your essay currently ranks in the <strong>middle tier</strong>.
                          To move to the top tier, focus on specificity, demonstrated impact, and clear program-fit alignment.
                          Strong essays don't just list achievements—they show intellectual growth and unique perspective.
                        </p>
                      </div>
                    </TabsContent>
                    {/* Action Plan Tab */}
                    <TabsContent value="action" className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Your 5-Step Improvement Plan</h4>
                      {improvementPlan.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700 flex-1">{step}</p>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Example Rewrite: Introduction</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                            {rewriteSuggestion}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Educational Info */}
      {step !== 'feedback' && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Lightbulb className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">How This Tool Works</h3>
              <ul className="text-xs text-gray-700 space-y-1 mb-3">
                <li>• Our AI identifies the essay type from your prompt (motivational, personal challenge, leadership, etc.)</li>
                <li>• We evaluate your essay against criteria selection committees actually use</li>
                <li>• You get specific, actionable feedback - not vague comments</li>
                <li>• Every suggestion explains WHY it improves your essay</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-900">Important:</strong> AI feedback may contain inaccuracies and should be used as guidance, not as an absolute authority. Always review suggestions critically and consider seeking human feedback from teachers or mentors for final review.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}