/**
 * StudyEarn AI — Formula Sheet
 * Quick reference for Physics, Chemistry, Maths (Class 9–12 / CBSE)
 * Features: Search, Copy formula, Bookmark, Subject filter, Chapter filter
 */
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BookOpen, Search, Copy, Bookmark, BookmarkCheck,
  ChevronDown, ChevronUp, X, Zap, FlaskConical,
  Calculator, Atom, CheckCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const API_URL = import.meta.env.VITE_API_URL;

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
interface Formula {
  id: string;
  name: string;
  formula: string;
  variables?: string;   // what each symbol means
  unit?: string;
  example?: string;
  chapter: string;
}

interface Subject {
  id: string;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  chapters: { id: string; name: string }[];
  formulas: Formula[];
}

const SUBJECTS: Subject[] = [
  // ─── PHYSICS ────────────────────────────────────────────
  {
    id: "physics", name: "Physics", icon: Zap, color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
    chapters: [
      { id: "motion",       name: "Motion & Kinematics" },
      { id: "laws",         name: "Laws of Motion" },
      { id: "work",         name: "Work, Energy & Power" },
      { id: "gravitation",  name: "Gravitation" },
      { id: "waves",        name: "Waves & Sound" },
      { id: "light",        name: "Light & Optics" },
      { id: "electricity",  name: "Electricity" },
      { id: "magnetism",    name: "Magnetism" },
      { id: "modern",       name: "Modern Physics" },
    ],
    formulas: [
      // Motion & Kinematics
      { id: "p1",  chapter: "motion", name: "First Equation of Motion",   formula: "v = u + at",            variables: "v=final velocity, u=initial velocity, a=acceleration, t=time", unit: "m/s" },
      { id: "p2",  chapter: "motion", name: "Second Equation of Motion",  formula: "s = ut + ½at²",         variables: "s=displacement, u=initial velocity, a=acceleration, t=time", unit: "m" },
      { id: "p3",  chapter: "motion", name: "Third Equation of Motion",   formula: "v² = u² + 2as",         variables: "v=final velocity, u=initial velocity, a=acceleration, s=displacement" },
      { id: "p4",  chapter: "motion", name: "Average Velocity",           formula: "v_avg = (u + v) / 2",   variables: "u=initial, v=final velocity", unit: "m/s" },
      { id: "p5",  chapter: "motion", name: "Acceleration",               formula: "a = (v - u) / t",       variables: "v=final, u=initial velocity, t=time", unit: "m/s²" },
      // Laws of Motion
      { id: "p6",  chapter: "laws",   name: "Newton's Second Law",        formula: "F = ma",                variables: "F=force (N), m=mass (kg), a=acceleration (m/s²)", unit: "N" },
      { id: "p7",  chapter: "laws",   name: "Momentum",                   formula: "p = mv",                variables: "p=momentum, m=mass, v=velocity", unit: "kg·m/s" },
      { id: "p8",  chapter: "laws",   name: "Impulse",                    formula: "J = F·t = Δp",          variables: "J=impulse, F=force, t=time, Δp=change in momentum", unit: "N·s" },
      { id: "p9",  chapter: "laws",   name: "Law of Conservation of Momentum", formula: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂", variables: "m=mass, u=initial vel, v=final vel" },
      { id: "p10", chapter: "laws",   name: "Friction Force",             formula: "f = μN",               variables: "f=friction, μ=coefficient of friction, N=normal force", unit: "N" },
      // Work, Energy & Power
      { id: "p11", chapter: "work",   name: "Work Done",                  formula: "W = F·s·cos θ",         variables: "W=work, F=force, s=displacement, θ=angle between F & s", unit: "J" },
      { id: "p12", chapter: "work",   name: "Kinetic Energy",             formula: "KE = ½mv²",             variables: "m=mass, v=velocity", unit: "J" },
      { id: "p13", chapter: "work",   name: "Potential Energy",           formula: "PE = mgh",              variables: "m=mass, g=9.8 m/s², h=height", unit: "J" },
      { id: "p14", chapter: "work",   name: "Power",                      formula: "P = W/t = F·v",         variables: "P=power, W=work, t=time, F=force, v=velocity", unit: "W" },
      { id: "p15", chapter: "work",   name: "Efficiency",                 formula: "η = (Useful output / Input) × 100%", variables: "η=efficiency" },
      // Gravitation
      { id: "p16", chapter: "gravitation", name: "Universal Gravitation", formula: "F = Gm₁m₂/r²",         variables: "G=6.67×10⁻¹¹ N·m²/kg², m=masses, r=distance", unit: "N" },
      { id: "p17", chapter: "gravitation", name: "Acceleration due to Gravity", formula: "g = GM/R²",      variables: "G=gravitational constant, M=mass of Earth, R=radius", unit: "m/s²", example: "g = 9.8 m/s² on Earth surface" },
      { id: "p18", chapter: "gravitation", name: "Escape Velocity",       formula: "v_e = √(2gR)",          variables: "g=9.8 m/s², R=radius of Earth", unit: "m/s", example: "≈ 11.2 km/s for Earth" },
      { id: "p19", chapter: "gravitation", name: "Orbital Velocity",      formula: "v_o = √(gR)",           variables: "g=9.8 m/s², R=radius of orbit", unit: "m/s" },
      { id: "p20", chapter: "gravitation", name: "Kepler's Third Law",    formula: "T² ∝ r³",              variables: "T=period of revolution, r=orbital radius" },
      // Waves & Sound
      { id: "p21", chapter: "waves",  name: "Wave Speed",                 formula: "v = fλ",               variables: "v=speed, f=frequency, λ=wavelength", unit: "m/s" },
      { id: "p22", chapter: "waves",  name: "Time Period & Frequency",    formula: "T = 1/f",              variables: "T=time period (s), f=frequency (Hz)", unit: "s" },
      { id: "p23", chapter: "waves",  name: "Speed of Sound in Air",      formula: "v = 331 + 0.6T m/s",   variables: "T=temperature in °C", example: "v ≈ 343 m/s at 20°C" },
      { id: "p24", chapter: "waves",  name: "Doppler Effect",             formula: "f' = f(v ± v_o)/(v ∓ v_s)", variables: "f'=observed freq, v=sound speed, v_o=observer speed, v_s=source speed" },
      // Light & Optics
      { id: "p25", chapter: "light",  name: "Snell's Law",                formula: "n₁ sin θ₁ = n₂ sin θ₂",variables: "n=refractive index, θ=angle with normal" },
      { id: "p26", chapter: "light",  name: "Refractive Index",           formula: "n = c/v = sin i / sin r", variables: "c=speed of light, v=speed in medium", example: "n_water ≈ 1.33" },
      { id: "p27", chapter: "light",  name: "Mirror Formula",             formula: "1/f = 1/v + 1/u",      variables: "f=focal length, v=image distance, u=object distance", unit: "cm/m" },
      { id: "p28", chapter: "light",  name: "Lens Formula",               formula: "1/f = 1/v - 1/u",      variables: "f=focal length, v=image dist, u=object dist", unit: "cm/m" },
      { id: "p29", chapter: "light",  name: "Magnification (Mirror)",     formula: "m = -v/u = h'/h",      variables: "v=image dist, u=object dist, h'=image height, h=object height" },
      { id: "p30", chapter: "light",  name: "Lens Power",                 formula: "P = 1/f (metres)",     variables: "P=power in Dioptre (D), f=focal length in metres", unit: "D" },
      // Electricity
      { id: "p31", chapter: "electricity", name: "Ohm's Law",            formula: "V = IR",               variables: "V=voltage (V), I=current (A), R=resistance (Ω)", unit: "V" },
      { id: "p32", chapter: "electricity", name: "Resistance",           formula: "R = ρL/A",             variables: "ρ=resistivity, L=length, A=cross-section area", unit: "Ω" },
      { id: "p33", chapter: "electricity", name: "Resistors in Series",  formula: "R_s = R₁ + R₂ + R₃",  variables: "Total resistance = sum of all" },
      { id: "p34", chapter: "electricity", name: "Resistors in Parallel",formula: "1/R_p = 1/R₁ + 1/R₂ + 1/R₃", variables: "Reciprocal of total = sum of reciprocals" },
      { id: "p35", chapter: "electricity", name: "Electric Power",       formula: "P = VI = I²R = V²/R",  variables: "P=power (W), V=voltage, I=current, R=resistance", unit: "W" },
      { id: "p36", chapter: "electricity", name: "Electric Energy",      formula: "E = Pt = VIt",         variables: "E=energy (J or kWh), P=power, t=time", unit: "J" },
      { id: "p37", chapter: "electricity", name: "Joule's Heating Law",  formula: "H = I²Rt",             variables: "H=heat (J), I=current, R=resistance, t=time", unit: "J" },
      // Magnetism
      { id: "p38", chapter: "magnetism", name: "Force on Current (Motor)", formula: "F = BIL sin θ",      variables: "B=magnetic field, I=current, L=length, θ=angle", unit: "N" },
      { id: "p39", chapter: "magnetism", name: "Magnetic Flux",          formula: "Φ = BA cos θ",         variables: "Φ=flux (Wb), B=field, A=area, θ=angle", unit: "Wb" },
      { id: "p40", chapter: "magnetism", name: "EMF (Faraday's Law)",    formula: "ε = -NΔΦ/Δt",          variables: "ε=induced EMF, N=turns, ΔΦ=change in flux, Δt=time", unit: "V" },
      { id: "p41", chapter: "magnetism", name: "Transformer Ratio",      formula: "Vₛ/Vₚ = Nₛ/Nₚ = Iₚ/Iₛ", variables: "V=voltage, N=turns, I=current, p=primary, s=secondary" },
      // Modern Physics
      { id: "p42", chapter: "modern",  name: "Photoelectric Effect",     formula: "KE_max = hf - φ",      variables: "h=6.626×10⁻³⁴ J·s, f=frequency, φ=work function", unit: "J/eV" },
      { id: "p43", chapter: "modern",  name: "de Broglie Wavelength",    formula: "λ = h/mv = h/p",       variables: "h=Planck's constant, m=mass, v=velocity, p=momentum" },
      { id: "p44", chapter: "modern",  name: "Mass-Energy Equivalence",  formula: "E = mc²",              variables: "E=energy, m=mass, c=3×10⁸ m/s", example: "Einstein's famous equation" },
      { id: "p45", chapter: "modern",  name: "Half-Life",                formula: "T½ = 0.693/λ",         variables: "T½=half-life, λ=decay constant" },
    ],
  },

  // ─── CHEMISTRY ──────────────────────────────────────────
  {
    id: "chemistry", name: "Chemistry", icon: FlaskConical, color: "text-green-400",
    gradient: "from-green-500 to-emerald-500",
    chapters: [
      { id: "basic",       name: "Basic Concepts" },
      { id: "atomic",      name: "Atomic Structure" },
      { id: "bonding",     name: "Chemical Bonding" },
      { id: "thermo",      name: "Thermodynamics" },
      { id: "equilibrium", name: "Equilibrium" },
      { id: "kinetics",    name: "Chemical Kinetics" },
      { id: "electro",     name: "Electrochemistry" },
      { id: "solutions",   name: "Solutions" },
    ],
    formulas: [
      // Basic
      { id: "c1",  chapter: "basic",       name: "Molar Mass",              formula: "M = mass(g) / moles(mol)",   variables: "M=molar mass (g/mol)", unit: "g/mol" },
      { id: "c2",  chapter: "basic",       name: "Number of Moles",         formula: "n = m/M = N/Nₐ",            variables: "m=mass, M=molar mass, N=particles, Nₐ=6.022×10²³" },
      { id: "c3",  chapter: "basic",       name: "Avogadro's Number",       formula: "Nₐ = 6.022 × 10²³ mol⁻¹",  variables: "Number of particles in 1 mole" },
      { id: "c4",  chapter: "basic",       name: "Percentage Composition",  formula: "%element = (mass of element / molar mass) × 100", variables: "For finding empirical formula" },
      { id: "c5",  chapter: "basic",       name: "Ideal Gas Law",           formula: "PV = nRT",                  variables: "P=pressure, V=volume, n=moles, R=8.314 J/mol·K, T=temp(K)", unit: "Pa·m³" },
      { id: "c6",  chapter: "basic",       name: "Combined Gas Law",        formula: "P₁V₁/T₁ = P₂V₂/T₂",       variables: "P=pressure, V=volume, T=temperature(K)" },
      { id: "c7",  chapter: "basic",       name: "Graham's Law of Diffusion", formula: "r₁/r₂ = √(M₂/M₁)",      variables: "r=rate of diffusion, M=molar mass" },
      // Atomic Structure
      { id: "c8",  chapter: "atomic",      name: "Energy of Electron (Bohr)", formula: "Eₙ = -13.6/n² eV",       variables: "n=principal quantum number, Energy in eV", unit: "eV" },
      { id: "c9",  chapter: "atomic",      name: "Radius of Bohr Orbit",    formula: "rₙ = 0.529 × n² Å",       variables: "n=principal quantum number", unit: "Å" },
      { id: "c10", chapter: "atomic",      name: "de Broglie (electron)",    formula: "λ = h/mv",                 variables: "h=6.626×10⁻³⁴ J·s, m=mass, v=velocity" },
      { id: "c11", chapter: "atomic",      name: "Heisenberg Uncertainty",   formula: "Δx·Δp ≥ h/4π",            variables: "Δx=position uncertainty, Δp=momentum uncertainty" },
      // Thermodynamics
      { id: "c12", chapter: "thermo",      name: "First Law of Thermodynamics", formula: "ΔU = q + w",            variables: "ΔU=internal energy, q=heat, w=work" },
      { id: "c13", chapter: "thermo",      name: "Enthalpy",                formula: "ΔH = ΔU + ΔngRT",          variables: "Δng=change in moles of gas, R=8.314, T=temperature(K)" },
      { id: "c14", chapter: "thermo",      name: "Gibbs Free Energy",       formula: "ΔG = ΔH - TΔS",            variables: "ΔG=free energy, T=temperature(K), ΔS=entropy change", example: "ΔG<0 → spontaneous" },
      { id: "c15", chapter: "thermo",      name: "Hess's Law",              formula: "ΔH_rxn = ΣΔHf(products) - ΣΔHf(reactants)", variables: "ΔHf=standard enthalpy of formation" },
      { id: "c16", chapter: "thermo",      name: "Entropy",                 formula: "ΔS = q_rev / T",           variables: "q_rev=reversible heat, T=temperature(K)", unit: "J/K" },
      // Equilibrium
      { id: "c17", chapter: "equilibrium", name: "Equilibrium Constant Kc", formula: "Kc = [products]^p / [reactants]^r", variables: "[ ]=molar concentration, p,r=stoichiometric coefficients" },
      { id: "c18", chapter: "equilibrium", name: "Relation Kp and Kc",      formula: "Kp = Kc(RT)^Δn",           variables: "R=0.0821 L·atm/mol·K, T=temp(K), Δn=moles gas(products-reactants)" },
      { id: "c19", chapter: "equilibrium", name: "Henderson-Hasselbalch",   formula: "pH = pKa + log([A⁻]/[HA])", variables: "pKa=-log(Ka), [A⁻]=conjugate base, [HA]=weak acid" },
      { id: "c20", chapter: "equilibrium", name: "pH of Solution",          formula: "pH = -log[H⁺]",            variables: "[H⁺]=hydrogen ion concentration", example: "pH+pOH=14 at 25°C" },
      { id: "c21", chapter: "equilibrium", name: "Solubility Product Ksp",  formula: "Ksp = [Mⁿ⁺]^a[Xⁿ⁻]^b",   variables: "a,b=ions in formula unit", example: "CaCO₃: Ksp=[Ca²⁺][CO₃²⁻]" },
      // Kinetics
      { id: "c22", chapter: "kinetics",    name: "Rate Law",                formula: "r = k[A]^m[B]^n",          variables: "k=rate constant, [A][B]=concentrations, m,n=orders" },
      { id: "c23", chapter: "kinetics",    name: "Arrhenius Equation",      formula: "k = Ae^(-Ea/RT)",           variables: "A=frequency factor, Ea=activation energy, R=8.314, T=temp(K)" },
      { id: "c24", chapter: "kinetics",    name: "Half-Life (1st order)",   formula: "t½ = 0.693/k",             variables: "k=first order rate constant" },
      { id: "c25", chapter: "kinetics",    name: "Integrated Rate (1st order)", formula: "ln[A]t = ln[A]₀ - kt", variables: "[A]t=conc at time t, [A]₀=initial conc, k=rate const" },
      // Electrochemistry
      { id: "c26", chapter: "electro",     name: "Nernst Equation",         formula: "E = E° - (RT/nF)lnQ",      variables: "E°=standard EMF, n=electrons, F=96500 C/mol, Q=reaction quotient" },
      { id: "c27", chapter: "electro",     name: "Cell EMF",                formula: "E°cell = E°cathode - E°anode", variables: "More positive = spontaneous cell" },
      { id: "c28", chapter: "electro",     name: "Faraday's Law",           formula: "m = (M × I × t) / (n × F)", variables: "m=mass deposited, M=molar mass, I=current, t=time, n=electrons, F=96500" },
      { id: "c29", chapter: "electro",     name: "ΔG and EMF",              formula: "ΔG° = -nFE°",              variables: "n=moles electrons, F=96500 C/mol, E°=cell potential" },
      // Solutions
      { id: "c30", chapter: "solutions",   name: "Molarity",                formula: "M = moles of solute / L of solution", variables: "M=molarity (mol/L)", unit: "mol/L" },
      { id: "c31", chapter: "solutions",   name: "Molality",                formula: "m = moles of solute / kg of solvent", variables: "m=molality (mol/kg)", unit: "mol/kg" },
      { id: "c32", chapter: "solutions",   name: "Mole Fraction",           formula: "χA = nA / (nA + nB)",      variables: "n=moles, χ=mole fraction (0 to 1)" },
      { id: "c33", chapter: "solutions",   name: "Raoult's Law",            formula: "Psoln = χsolvent × P°solvent", variables: "P°=vapour pressure of pure solvent" },
      { id: "c34", chapter: "solutions",   name: "Elevation of Boiling Point", formula: "ΔTb = Kb × m",          variables: "Kb=ebullioscopic constant, m=molality", unit: "°C" },
      { id: "c35", chapter: "solutions",   name: "Depression of Freezing Point", formula: "ΔTf = Kf × m",        variables: "Kf=cryoscopic constant, m=molality", unit: "°C" },
      { id: "c36", chapter: "solutions",   name: "Osmotic Pressure",        formula: "π = MRT",                  variables: "M=molarity, R=0.0821 L·atm/mol·K, T=temp(K)", unit: "atm" },
    ],
  },

  // ─── MATHEMATICS ────────────────────────────────────────
  {
    id: "maths", name: "Mathematics", icon: Calculator, color: "text-purple-400",
    gradient: "from-purple-500 to-pink-500",
    chapters: [
      { id: "algebra",      name: "Algebra" },
      { id: "trigonometry", name: "Trigonometry" },
      { id: "geometry",     name: "Geometry" },
      { id: "calculus",     name: "Calculus" },
      { id: "statistics",   name: "Statistics & Probability" },
      { id: "coordinate",   name: "Coordinate Geometry" },
      { id: "vectors",      name: "Vectors & 3D" },
    ],
    formulas: [
      // Algebra
      { id: "m1",  chapter: "algebra",      name: "(a+b)² Identity",        formula: "(a+b)² = a² + 2ab + b²",   example: "(x+3)² = x²+6x+9" },
      { id: "m2",  chapter: "algebra",      name: "(a-b)² Identity",        formula: "(a-b)² = a² - 2ab + b²",   example: "(x-3)² = x²-6x+9" },
      { id: "m3",  chapter: "algebra",      name: "(a+b)(a-b) Identity",    formula: "(a+b)(a-b) = a² - b²",     example: "(x+4)(x-4) = x²-16" },
      { id: "m4",  chapter: "algebra",      name: "(a+b)³ Identity",        formula: "(a+b)³ = a³ + 3a²b + 3ab² + b³" },
      { id: "m5",  chapter: "algebra",      name: "(a-b)³ Identity",        formula: "(a-b)³ = a³ - 3a²b + 3ab² - b³" },
      { id: "m6",  chapter: "algebra",      name: "a³+b³ Factorisation",    formula: "a³+b³ = (a+b)(a²-ab+b²)" },
      { id: "m7",  chapter: "algebra",      name: "a³-b³ Factorisation",    formula: "a³-b³ = (a-b)(a²+ab+b²)" },
      { id: "m8",  chapter: "algebra",      name: "Quadratic Formula",      formula: "x = (-b ± √(b²-4ac)) / 2a",  variables: "For ax²+bx+c=0", example: "Discriminant D=b²-4ac" },
      { id: "m9",  chapter: "algebra",      name: "Sum of AP",              formula: "Sₙ = n/2 × (2a + (n-1)d)",  variables: "a=first term, d=common difference, n=terms" },
      { id: "m10", chapter: "algebra",      name: "nth Term of AP",         formula: "aₙ = a + (n-1)d",            variables: "a=first term, d=common difference" },
      { id: "m11", chapter: "algebra",      name: "Sum of GP",              formula: "Sₙ = a(rⁿ-1)/(r-1)",        variables: "a=first term, r=common ratio (r≠1)" },
      { id: "m12", chapter: "algebra",      name: "nth Term of GP",         formula: "aₙ = arⁿ⁻¹",                variables: "a=first term, r=common ratio" },
      { id: "m13", chapter: "algebra",      name: "Sum of Infinite GP",     formula: "S∞ = a/(1-r), |r|<1",       variables: "a=first term, r=common ratio" },
      { id: "m14", chapter: "algebra",      name: "Binomial Theorem",       formula: "(a+b)ⁿ = Σ ⁿCr · aⁿ⁻ʳ · bʳ", variables: "ⁿCr = n!/(r!(n-r)!)" },
      // Trigonometry
      { id: "m15", chapter: "trigonometry", name: "Pythagorean Identity",   formula: "sin²θ + cos²θ = 1",          example: "Also: 1+tan²θ=sec²θ, 1+cot²θ=cosec²θ" },
      { id: "m16", chapter: "trigonometry", name: "sin(A±B)",               formula: "sin(A±B) = sinA·cosB ± cosA·sinB" },
      { id: "m17", chapter: "trigonometry", name: "cos(A±B)",               formula: "cos(A±B) = cosA·cosB ∓ sinA·sinB" },
      { id: "m18", chapter: "trigonometry", name: "tan(A+B)",               formula: "tan(A+B) = (tanA+tanB)/(1-tanA·tanB)" },
      { id: "m19", chapter: "trigonometry", name: "Double Angle sin",       formula: "sin 2A = 2 sinA cosA",       example: "sin 2A = 2tanA/(1+tan²A)" },
      { id: "m20", chapter: "trigonometry", name: "Double Angle cos",       formula: "cos 2A = cos²A - sin²A = 1-2sin²A = 2cos²A-1" },
      { id: "m21", chapter: "trigonometry", name: "Double Angle tan",       formula: "tan 2A = 2tanA/(1-tan²A)" },
      { id: "m22", chapter: "trigonometry", name: "Sine Rule",              formula: "a/sinA = b/sinB = c/sinC = 2R", variables: "a,b,c=sides, A,B,C=opposite angles, R=circumradius" },
      { id: "m23", chapter: "trigonometry", name: "Cosine Rule",            formula: "c² = a² + b² - 2ab cosC",   variables: "a,b,c=sides, C=angle opposite to c" },
      { id: "m24", chapter: "trigonometry", name: "Area of Triangle",       formula: "Area = ½ab sinC",            variables: "a,b=sides, C=included angle" },
      { id: "m25", chapter: "trigonometry", name: "Values: sin 30°,45°,60°", formula: "sin30°=½, sin45°=1/√2, sin60°=√3/2", example: "cos: reverse order, tan=sin/cos" },
      // Geometry / Mensuration
      { id: "m26", chapter: "geometry",     name: "Area of Circle",         formula: "A = πr²",                   variables: "r=radius", unit: "cm²" },
      { id: "m27", chapter: "geometry",     name: "Circumference",          formula: "C = 2πr",                   variables: "r=radius", unit: "cm" },
      { id: "m28", chapter: "geometry",     name: "Area of Triangle",       formula: "A = ½ × base × height",     example: "Also: Heron's formula A=√(s(s-a)(s-b)(s-c))" },
      { id: "m29", chapter: "geometry",     name: "Volume of Sphere",       formula: "V = (4/3)πr³",              unit: "cm³" },
      { id: "m30", chapter: "geometry",     name: "Surface Area of Sphere", formula: "SA = 4πr²",                 unit: "cm²" },
      { id: "m31", chapter: "geometry",     name: "Volume of Cylinder",     formula: "V = πr²h",                  variables: "r=radius, h=height", unit: "cm³" },
      { id: "m32", chapter: "geometry",     name: "Volume of Cone",         formula: "V = (1/3)πr²h",             variables: "r=radius, h=height", unit: "cm³" },
      { id: "m33", chapter: "geometry",     name: "Slant Height of Cone",   formula: "l = √(r² + h²)",            variables: "r=radius, h=height", unit: "cm" },
      { id: "m34", chapter: "geometry",     name: "Volume of Cuboid",       formula: "V = l × b × h",             unit: "cm³" },
      { id: "m35", chapter: "geometry",     name: "Diagonal of Cuboid",     formula: "d = √(l² + b² + h²)",       unit: "cm" },
      // Calculus
      { id: "m36", chapter: "calculus",     name: "Derivative: Power Rule", formula: "d/dx(xⁿ) = nxⁿ⁻¹",         example: "d/dx(x³) = 3x²" },
      { id: "m37", chapter: "calculus",     name: "Derivative: Chain Rule", formula: "d/dx[f(g(x))] = f'(g(x))·g'(x)" },
      { id: "m38", chapter: "calculus",     name: "Derivative: Product Rule", formula: "d/dx[u·v] = u'v + uv'" },
      { id: "m39", chapter: "calculus",     name: "Derivative: Quotient Rule", formula: "d/dx[u/v] = (u'v - uv')/v²" },
      { id: "m40", chapter: "calculus",     name: "Common Derivatives",     formula: "d/dx(sin x)=cos x, d/dx(cos x)=-sin x, d/dx(eˣ)=eˣ, d/dx(ln x)=1/x" },
      { id: "m41", chapter: "calculus",     name: "Integral: Power Rule",   formula: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C",  example: "∫x² dx = x³/3 + C" },
      { id: "m42", chapter: "calculus",     name: "Common Integrals",       formula: "∫sin x dx=-cos x, ∫cos x dx=sin x, ∫eˣ dx=eˣ, ∫1/x dx=ln|x|" },
      { id: "m43", chapter: "calculus",     name: "Definite Integral",      formula: "∫[a to b] f(x) dx = F(b) - F(a)", variables: "F(x) = antiderivative of f(x)" },
      { id: "m44", chapter: "calculus",     name: "Fundamental Theorem",    formula: "d/dx[∫(a to x) f(t)dt] = f(x)" },
      // Statistics & Probability
      { id: "m45", chapter: "statistics",   name: "Mean",                   formula: "x̄ = Σx / n",               variables: "Σx=sum of all values, n=count" },
      { id: "m46", chapter: "statistics",   name: "Variance",               formula: "σ² = Σ(xᵢ - x̄)² / n",     variables: "σ²=variance, x̄=mean" },
      { id: "m47", chapter: "statistics",   name: "Standard Deviation",     formula: "σ = √(Σ(xᵢ - x̄)² / n)",   variables: "Lower σ = more consistent data" },
      { id: "m48", chapter: "statistics",   name: "Probability",            formula: "P(A) = favourable outcomes / total outcomes", example: "P(A)+P(A')=1" },
      { id: "m49", chapter: "statistics",   name: "Conditional Probability",formula: "P(A|B) = P(A∩B) / P(B)",   variables: "Probability of A given B occurred" },
      { id: "m50", chapter: "statistics",   name: "Bayes Theorem",          formula: "P(A|B) = P(B|A)·P(A) / P(B)" },
      { id: "m51", chapter: "statistics",   name: "Permutations",           formula: "nPr = n! / (n-r)!",         example: "4P2 = 4×3 = 12" },
      { id: "m52", chapter: "statistics",   name: "Combinations",           formula: "nCr = n! / (r!(n-r)!)",     example: "4C2 = 6" },
      // Coordinate Geometry
      { id: "m53", chapter: "coordinate",   name: "Distance Formula",       formula: "d = √((x₂-x₁)² + (y₂-y₁)²)", variables: "Between points (x₁,y₁) and (x₂,y₂)" },
      { id: "m54", chapter: "coordinate",   name: "Midpoint Formula",       formula: "M = ((x₁+x₂)/2, (y₁+y₂)/2)" },
      { id: "m55", chapter: "coordinate",   name: "Section Formula",        formula: "P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))", variables: "Divides in ratio m:n" },
      { id: "m56", chapter: "coordinate",   name: "Slope of Line",          formula: "m = (y₂-y₁)/(x₂-x₁) = tanθ" },
      { id: "m57", chapter: "coordinate",   name: "Equation of Line",       formula: "y - y₁ = m(x - x₁)",       variables: "m=slope, (x₁,y₁)=point on line" },
      { id: "m58", chapter: "coordinate",   name: "Standard Circle",        formula: "(x-h)² + (y-k)² = r²",     variables: "(h,k)=centre, r=radius" },
      // Vectors & 3D
      { id: "m59", chapter: "vectors",      name: "Magnitude of Vector",    formula: "|a⃗| = √(x² + y² + z²)",    variables: "a⃗ = xi + yj + zk" },
      { id: "m60", chapter: "vectors",      name: "Dot Product",            formula: "a⃗·b⃗ = |a||b|cosθ = x₁x₂+y₁y₂+z₁z₂", variables: "θ=angle between vectors" },
      { id: "m61", chapter: "vectors",      name: "Cross Product Magnitude",formula: "|a⃗×b⃗| = |a||b|sinθ",       variables: "Direction: right-hand rule" },
      { id: "m62", chapter: "vectors",      name: "Angle Between Vectors",  formula: "cosθ = (a⃗·b⃗) / (|a||b|)",  example: "θ=90° → vectors are perpendicular" },
      { id: "m63", chapter: "vectors",      name: "Distance (3D)",          formula: "d = √((x₂-x₁)²+(y₂-y₁)²+(z₂-z₁)²)" },
    ],
  },

  // ─── BIOLOGY (Basic) ────────────────────────────────────
  {
    id: "biology", name: "Biology", icon: Atom, color: "text-pink-400",
    gradient: "from-pink-500 to-rose-500",
    chapters: [
      { id: "genetics",     name: "Genetics & Heredity" },
      { id: "ecology",      name: "Ecology" },
      { id: "physiology",   name: "Physiology" },
    ],
    formulas: [
      { id: "b1",  chapter: "genetics",   name: "Hardy-Weinberg Principle", formula: "p² + 2pq + q² = 1",        variables: "p=dominant allele freq, q=recessive allele freq", example: "p+q=1" },
      { id: "b2",  chapter: "genetics",   name: "Allele Frequencies",       formula: "p + q = 1",                variables: "p=freq of dominant, q=freq of recessive allele" },
      { id: "b3",  chapter: "ecology",    name: "Population Growth",        formula: "dN/dt = rN",               variables: "N=population, r=growth rate, t=time" },
      { id: "b4",  chapter: "ecology",    name: "Logistic Growth",          formula: "dN/dt = rN(K-N)/K",        variables: "K=carrying capacity, N=population" },
      { id: "b5",  chapter: "ecology",    name: "BMI",                      formula: "BMI = weight(kg) / height(m)²", example: "Normal: 18.5–24.9", unit: "kg/m²" },
      { id: "b6",  chapter: "physiology", name: "Cardiac Output",           formula: "CO = Heart Rate × Stroke Volume", variables: "CO in L/min, HR in bpm, SV in mL/beat", unit: "L/min" },
      { id: "b7",  chapter: "physiology", name: "Magnification (Microscope)", formula: "Magnification = Image size / Actual size" },
      { id: "b8",  chapter: "physiology", name: "Respiratory Quotient",     formula: "RQ = CO₂ released / O₂ consumed", example: "Carbs: RQ=1, Fat: RQ=0.7, Protein: RQ=0.9" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export function FormulaSheet() {
  const { userId } = useApp();
  const [activeSubject, setActiveSubject]   = useState<string>("physics");
  const [activeChapter, setActiveChapter]   = useState<string>("all");
  const [search, setSearch]                 = useState("");
  const [bookmarks, setBookmarks]           = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId]             = useState<string | null>(null);
  const [expandedId, setExpandedId]         = useState<string | null>(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load bookmarks from server on mount ──────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_URL}/api/user/formula-bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.bookmarks)) {
          setBookmarks(new Set(d.bookmarks));
        }
      })
      .catch(() => {})
      .finally(() => setBookmarksLoaded(true));
  }, []); // eslint-disable-line

  // ── Debounced save — fires 600ms after last toggle ───────
  const saveBookmarks = (next: Set<string>) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
      fetch(`${API_URL}/api/user/formula-bookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookmarks: Array.from(next) }),
      }).catch(() => {});
    }, 600);
  };

  const subject = SUBJECTS.find(s => s.id === activeSubject)!;

  const filtered = useMemo(() => {
    let list = subject.formulas;
    if (activeChapter !== "all") list = list.filter(f => f.chapter === activeChapter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.formula.toLowerCase().includes(q) ||
        (f.variables || "").toLowerCase().includes(q)
      );
    }
    if (showBookmarksOnly) list = list.filter(f => bookmarks.has(f.id));
    return list;
  }, [subject, activeChapter, search, showBookmarksOnly, bookmarks]);

  const copyFormula = (formula: Formula) => {
    navigator.clipboard.writeText(formula.formula).catch(() => {});
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveBookmarks(next);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" /> Formula Sheet
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Physics • Chemistry • Maths • Biology — Class 9–12 CBSE
          </p>
        </div>
        {/* Bookmarks toggle */}
        <button
          onClick={() => setShowBookmarksOnly(b => !b)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all
            ${showBookmarksOnly
              ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
              : "border-white/10 text-slate-400 hover:text-white"}`}>
          <Bookmark className="w-4 h-4" />
          Bookmarks ({bookmarks.size})
        </button>
      </div>

      {/* Subject tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUBJECTS.map(s => (
          <button key={s.id}
            onClick={() => { setActiveSubject(s.id); setActiveChapter("all"); setSearch(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all
              ${activeSubject === s.id
                ? `bg-gradient-to-r ${s.gradient} bg-opacity-20 border-white/20 text-white`
                : "border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"}`}>
            <s.icon className={`w-4 h-4 ${activeSubject === s.id ? "text-white" : s.color}`} />
            {s.name}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeSubject === s.id ? "bg-white/20" : "bg-white/5"}`}>
              {s.formulas.length}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Chapter filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search formulas, equations…"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500/40 transition-colors" />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chapter filter */}
        <select value={activeChapter} onChange={e => setActiveChapter(e.target.value)}
          className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-purple-500/40 cursor-pointer">
          <option value="all">All Chapters ({subject.formulas.length})</option>
          {subject.chapters.map(ch => {
            const count = subject.formulas.filter(f => f.chapter === ch.id).length;
            return <option key={ch.id} value={ch.id}>{ch.name} ({count})</option>;
          })}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filtered.length} formula{filtered.length !== 1 ? "s" : ""}
          {activeChapter !== "all" && ` in ${subject.chapters.find(c => c.id === activeChapter)?.name}`}
          {search && ` matching "${search}"`}
        </p>
        {showBookmarksOnly && bookmarks.size === 0 && (
          <p className="text-xs text-yellow-500/70">No bookmarks yet — click ⭐ to bookmark formulas</p>
        )}
      </div>

      {/* Formula cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No formulas found.</p>
          {search && <p className="text-slate-600 text-xs mt-1">Try a different search term</p>}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(formula => {
            const isExpanded  = expandedId === formula.id;
            const isBookmarked = bookmarks.has(formula.id);
            const isCopied    = copiedId === formula.id;
            const chapterName = subject.chapters.find(c => c.id === formula.chapter)?.name;

            return (
              <div key={formula.id}
                className="rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all overflow-hidden">
                {/* Main row */}
                <div className="flex items-start gap-4 p-4">
                  {/* Formula name + formula */}
                  <div className="flex-1 min-w-0" onClick={() => setExpandedId(isExpanded ? null : formula.id)}
                    style={{ cursor: "pointer" }}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-white">{formula.name}</span>
                      {chapterName && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
                          {chapterName}
                        </span>
                      )}
                      {formula.unit && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                          {formula.unit}
                        </span>
                      )}
                    </div>
                    {/* The Formula itself — prominent */}
                    <div className="font-mono text-base sm:text-lg font-bold text-cyan-300 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5 inline-block max-w-full break-all">
                      {formula.formula}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Copy */}
                    <button onClick={() => copyFormula(formula)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        ${isCopied ? "bg-green-500/20 text-green-400" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
                      title="Copy formula">
                      {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {/* Bookmark */}
                    <button onClick={() => toggleBookmark(formula.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        ${isBookmarked ? "bg-yellow-500/20 text-yellow-400" : "text-slate-500 hover:text-yellow-400 hover:bg-white/5"}`}
                      title="Bookmark">
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                    {/* Expand */}
                    <button onClick={() => setExpandedId(isExpanded ? null : formula.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                      title="Show details">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (formula.variables || formula.example) && (
                  <div className="px-4 pb-4 pt-0 space-y-2 border-t border-white/5">
                    {formula.variables && (
                      <div className="bg-white/[0.02] rounded-xl p-3">
                        <p className="text-[11px] text-slate-500 font-medium mb-1">Variables:</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{formula.variables}</p>
                      </div>
                    )}
                    {formula.example && (
                      <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                        <p className="text-[11px] text-blue-400 font-medium mb-1">💡 Note:</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{formula.example}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}