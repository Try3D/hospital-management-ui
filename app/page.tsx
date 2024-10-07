'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'

export default function HospitalDashboard() {
  const { toast } = useToast()
  const [totalBeds, setTotalBeds] = useState(100)
  const [availableBeds, setAvailableBeds] = useState(75)
  const [specializations, setSpecializations] = useState([
    { name: 'Cardiology', total: 10, available: 8 },
    { name: 'Neurology', total: 8, available: 7 },
    { name: 'Pediatrics', total: 13, available: 11 },
    { name: 'Oncology', total: 10, available: 7 },
    { name: 'Dermatology', total: 7, available: 6 },
    { name: 'Endocrinology', total: 6, available: 4 },
    { name: 'Ophthalmology', total: 8, available: 6 },
    { name: 'Gastroenterology', total: 9, available: 6 },
    { name: 'Pulmonology', total: 7, available: 6 },
    { name: 'Rheumatology', total: 5, available: 5 },
    { name: 'Nephrology', total: 5, available: 0 },
    { name: 'Urology', total: 7, available: 5 },
    { name: 'Hematology', total: 5, available: 4 }
  ])
  const [filter, setFilter] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState(30)
  const [patientGender, setPatientGender] = useState('Male')
  const [patientSpecialization, setPatientSpecialization] = useState('')
  const [admissionPriority, setAdmissionPriority] = useState('Medium')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [admittedPatients, setAdmittedPatients] = useState([
    { name: "Arun Kumar", specialization: "cardiology" },
    { name: "Priya Sharma", specialization: "cardiology" },

    { name: "Anitha Reddy", specialization: "neurology" },

    { name: "Lakshmi Iyer", specialization: "pediatrics" },
    { name: "Rahul Nair", specialization: "pediatrics" },

    { name: "Vikram Mehta", specialization: "oncology" },
    { name: "Divya Rajan", specialization: "oncology" },
    { name: "Suresh Patel", specialization: "oncology" },

    { name: "Revathi Krishnan", specialization: "dermatology" },

    { name: "Sindhu Menon", specialization: "endocrinology" },
    { name: "Ashok Babu", specialization: "endocrinology" },

    { name: "Deepa Narayan", specialization: "ophthalmology" },
    { name: "Karthik Venkatesan", specialization: "ophthalmology" },

    { name: "Ravi Shankar", specialization: "gastroenterology" },
    { name: "Swathi Ramesh", specialization: "gastroenterology" },
    { name: "Ajay Prasad", specialization: "gastroenterology" },

    { name: "Manoj Kumar", specialization: "pulmonology" },
    { name: "Arvind Natarajan", specialization: "pulmonology" },
    { name: "Anjali Mohan", specialization: "pulmonology" },

    { name: "Sangeetha Balakrishnan", specialization: "rheumatology" },

    { name: "Srinivasan Murthy", specialization: "nephrology" },
    { name: "Vishnu Das", specialization: "nephrology" },
    { name: "Meera Raghavan", specialization: "nephrology" },
    { name: "Vimal Narayanan", specialization: "nephrology" },
    { name: "Leela Subramanian", specialization: "nephrology" },

    { name: "Rajesh Varma", specialization: "urology" },
    { name: "Arjun Pillai", specialization: "urology" },

    { name: "Shreya Rao", specialization: "hematology" }
  ])

  const [dischargePatient, setDischargePatient] = useState('')

  const [dischargeCount, setDischargeCount] = useState(12)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAdmitPatient = () => {
    if (availableBeds > 0 && patientName && patientSpecialization) {
      setAvailableBeds(prev => prev - 1)
      setSpecializations(prev =>
        prev.map(spec =>
          spec.name === patientSpecialization
            ? { ...spec, available: spec.available - 1 }
            : spec
        )
      )
      setAdmittedPatients(prev => [...prev, { name: patientName, specialization: patientSpecialization }])
      toast({
        title: "Patient Admitted",
        description: `${patientName} has been successfully admitted.`,
      })
      setPatientName('')
      setPatientAge(30)
      setPatientGender('Male')
      setPatientSpecialization('')
      setAdmissionPriority('Medium')
    } else {
      toast({
        title: "Admission Failed",
        description: "Please check bed availability and fill in all required fields.",
        variant: "destructive",
      })
    }
  }

  const handleDischargePatient = () => {
    const patientToDischarge = admittedPatients.find(p => p.name === dischargePatient)
    if (patientToDischarge) {
      setAvailableBeds(prev => prev + 1)
      setSpecializations(prev =>
        prev.map(spec =>
          spec.name === patientToDischarge.specialization
            ? { ...spec, available: spec.available + 1 }
            : spec
        )
      )
      setAdmittedPatients(prev => prev.filter(p => p.name !== dischargePatient))
      toast({
        title: "Patient Discharged",
        description: `${dischargePatient} has been successfully discharged.`,
      })
      setDischargePatient('')
      for (let i of specializations) {
        if (i.name === patientToDischarge.specialization) {
          i.available += 1
          break
        }
      }
      setDischargeCount(dischargeCount + 1)
    } else {
      toast({
        title: "Discharge Failed",
        description: "Patient not found.",
        variant: "destructive",
      })
    }
  }

  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(filter.toLowerCase())
  )

  const bedOccupancyRate = ((totalBeds - availableBeds) / totalBeds) * 100

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Hospital Management System</h1>
      </header>

      <main className="p-6 space-y-6">
        <section className="bg-white p-4 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-blue-900 border-b border-gray-300 pb-2">Hospital Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-100 p-4 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Patients Admitted</h3>
              <div className="text-2xl font-bold text-blue-900">{totalBeds - availableBeds}</div>
            </div>
            <div className="bg-gray-100 p-4 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Avg. Doctor Availability</h3>
              <div className="text-2xl font-bold text-blue-900">
                {(specializations.reduce((acc, spec) => acc + (spec.available / spec.total), 0) / specializations.length * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-gray-100 p-4 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Bed Occupancy Rate</h3>
              <div className="text-2xl font-bold text-blue-900">{bedOccupancyRate.toFixed(1)}%</div>
            </div>
            <div className="bg-gray-100 p-4 border border-gray-300">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Discharged Today</h3>
              <div className="text-2xl font-bold text-blue-900">{dischargeCount}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-4 pt-4">
            <div className="flex-1 min-w-[200px] p-4 bg-gray-100 border border-gray-300">
              <h3 className="text-sm font-bold mb-2 text-gray-700">Total Beds</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 bg-white border-gray-300"
                />
                <Button onClick={() => setTotalBeds(prev => prev + 1)} size="sm" className="bg-blue-900 text-white hover:bg-blue-800">+</Button>
                <Button onClick={() => setTotalBeds(prev => Math.max(0, prev - 1))} size="sm" className="bg-blue-900 text-white hover:bg-blue-800">-</Button>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] p-4 bg-gray-100 border border-gray-300">
              <h3 className="text-sm font-bold mb-2 text-gray-700">Available Beds</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={availableBeds}
                  onChange={(e) => setAvailableBeds(Math.min(totalBeds, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-20 bg-white border-gray-300"
                />
                <Button
                  onClick={() => setAvailableBeds(prev => Math.min(totalBeds, prev + 1))}
                  size="sm"
                  className="bg-blue-900 text-white hover:bg-blue-800"
                >
                  +
                </Button>
                <Button
                  onClick={() => setAvailableBeds(prev => Math.max(0, prev - 1))}
                  size="sm"
                  className="bg-blue-900 text-white hover:bg-blue-800"
                >
                  -
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-4 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-blue-900 border-b border-gray-300 pb-2">Admit a New Patient</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-sm font-bold text-gray-700">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  className="bg-gray-100 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientAge" className="text-sm font-bold text-gray-700">Age</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="patientAge"
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 bg-gray-100 border-gray-300"
                  />
                  <Button onClick={() => setPatientAge(prev => prev + 1)} size="sm" className="bg-blue-900 text-white hover:bg-blue-800">+</Button>
                  <Button onClick={() => setPatientAge(prev => Math.max(0, prev - 1))} size="sm" className="bg-blue-900 text-white hover:bg-blue-800">-</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientGender" className="text-sm font-bold text-gray-700">Gender</Label>
                <Select value={patientGender} onValueChange={setPatientGender}>
                  <SelectTrigger id="patientGender" className="bg-gray-100 border-gray-300">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientSpecialization" className="text-sm font-bold text-gray-700">Specialization Required</Label>
                <Select value={patientSpecialization} onValueChange={setPatientSpecialization}>
                  <SelectTrigger id="patientSpecialization" className="bg-gray-100 border-gray-300">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec, index) => (
                      <SelectItem key={index} value={spec.name}>{spec.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Admission Priority</Label>
              <RadioGroup value={admissionPriority} onValueChange={setAdmissionPriority} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="low" />
                  <Label htmlFor="low" className="text-sm text-gray-600">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="medium" />
                  <Label htmlFor="medium" className="text-sm text-gray-600">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="high" />
                  <Label htmlFor="high" className="text-sm text-gray-600">High</Label>
                </div>
              </RadioGroup>
            </div>
            <Button onClick={handleAdmitPatient} className="w-full bg-blue-900 text-white hover:bg-blue-800">Admit Patient</Button>
          </div>
        </section>

        <section className="bg-white p-4 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-blue-900 border-b border-gray-300 pb-2">Doctor Availability by Specialization</h2>
          <Input
            type="text"
            placeholder="Filter specializations..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mb-4 bg-gray-100 border-gray-300"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSpecializations.map((spec, index) => (
              <div key={index} className="bg-gray-100 p-3 border border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-[#444]">{spec.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${spec.available > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total:</span>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={spec.total}
                        onChange={(e) => {
                          const newTotal = Math.max(0, parseInt(e.target.value) || 0)
                          setSpecializations(prev =>
                            prev.map(s => s.name === spec.name ? { ...s, total: newTotal, available: Math.min(s.available, newTotal) } : s)
                          )
                        }}
                        className="w-16 h-8 text-sm bg-white border-gray-300"
                      />
                      <Button
                        onClick={() => setSpecializations(prev =>
                          prev.map(s => s.name === spec.name ? { ...s, total: s.total + 1 } : s)
                        )}
                        size="sm"
                        className="h-8 px-2 min-w-[24px] bg-blue-900 text-white hover:bg-blue-800"
                      >
                        +
                      </Button>
                      <Button
                        onClick={() => setSpecializations(prev =>
                          prev.map(s => s.name === spec.name ? { ...s, total: Math.max(0, s.total - 1), available: Math.min(s.available, Math.max(0, s.total - 1)) } : s)
                        )}
                        size="sm"
                        className="h-8 px-2 min-w-[24px] bg-blue-900 text-white hover:bg-blue-800"
                      >
                        -
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available:</span>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        value={spec.available}
                        onChange={(e) => {
                          const newAvailable = Math.min(spec.total, Math.max(0, parseInt(e.target.value) || 0))
                          setSpecializations(prev =>
                            prev.map(s => s.name === spec.name ? { ...s, available: newAvailable } : s)
                          )
                        }}
                        className="w-16 h-8 text-sm bg-white border-gray-300"
                      />
                      <Button
                        onClick={() => setSpecializations(prev =>
                          prev.map(s => s.name === spec.name ? { ...s, available: Math.min(s.total, s.available + 1) } : s)
                        )}
                        size="sm"
                        className="h-8 px-2 min-w-[24px] bg-blue-900 text-white hover:bg-blue-800"
                      >
                        +
                      </Button>
                      <Button
                        onClick={() => setSpecializations(prev =>
                          prev.map(s => s.name === spec.name ? { ...s, available: Math.max(0, s.available - 1) } : s)
                        )}
                        size="sm"
                        className="h-8 px-2 min-w-[24px] bg-blue-900 text-white hover:bg-blue-800"
                      >
                        -
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-4 border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-blue-900 border-b border-gray-300 pb-2">Admitted Patients</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {admittedPatients.map((patient, index) => (
                <div key={index} className="bg-gray-100 p-3 border border-gray-300">
                  <p className="font-bold text-gray-700">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.specialization}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Select value={dischargePatient} onValueChange={setDischargePatient}>
                <SelectTrigger className="bg-gray-100 border-gray-300">
                  <SelectValue placeholder="Select patient to discharge" />
                </SelectTrigger>
                <SelectContent>
                  {admittedPatients.map((patient, index) => (
                    <SelectItem key={index} value={patient.name}>{patient.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleDischargePatient} className="bg-blue-900 text-white hover:bg-blue-800">Discharge Patient</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-900 text-white p-4 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="space-x-4 mb-4 sm:mb-0">
            <Button variant="link" className="text-white hover:text-gray-200">Settings</Button>
            <Button variant="link" className="text-white hover:text-gray-200">Support</Button>
            <Button variant="link" className="text-white hover:text-gray-200">Reports</Button>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
